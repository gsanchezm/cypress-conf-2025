import { BaseValidation } from '../../../common/validations/baseValidation.js'

/**
 * Validates that cart contains expected items and prices.
 * input:
 *   - expected: array of { title, priceNumber } OR alias name (string) where array is stored (e.g., 'pickedItems')
 *   - strictCount?: boolean (default true) → require same count
 *   - orderAgnostic?: boolean (default true) → compare as sets, not order
 */
export class ValidateCartItemsMatch extends BaseValidation {
  check(ctx, { expected, strictCount = true, orderAgnostic = true } = {}) {
    const readExpected = () => {
      if (typeof expected === 'string') return cy.get(`@${expected}`)
      return cy.wrap(expected)
    }

    // scrape items from the cart page
    const readCart = () =>
      ctx.$loc.cart.CART_ITEM_LIST.getAll().then($items => {
        const list = []
        Cypress.$($items).each((_i, el) => {
          const $el = Cypress.$(el)
          const title = ($el.find('.inventory_item_name').text() || '').trim()
          const priceText = ($el.find('.inventory_item_price').text() || '').trim()
          const priceNumber = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0
          list.push({ title, priceNumber })
        })
        return list
      })

    return cy
      .then(readExpected)
      .then(exp => readCart().then(actual => ({ exp, actual })))
      .then(({ exp, actual }) => {
        if (strictCount) expect(actual.length, 'cart items count').to.equal(exp.length)

        const norm = (arr) => arr.map(i => ({ t: i.title.trim(), p: +i.priceNumber }))
        const A = norm(actual)
        const E = norm(exp)

        if (orderAgnostic) {
          const toKey = (i) => `${i.t}::${i.p}`
          const setA = new Set(A.map(toKey))
          const setE = new Set(E.map(toKey))
          expect(setA, 'cart items set').to.deep.equal(setE)
        } else {
          expect(A, 'cart items sequence').to.deep.equal(E)
        }
      })
  }
}
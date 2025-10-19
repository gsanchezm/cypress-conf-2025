import { BaseValidation } from '../../../common/validations/baseValidation.js'

export class ValidateCartItemsMatch extends BaseValidation {
  check(ctx, { expected, strictCount = true, orderAgnostic = true } = {}) {
    const readExpected = () => (typeof expected === 'string'
      ? cy.get(`@${expected}`)
      : cy.wrap(expected))

    const readCart = () =>
      ctx.ui.do('cart', 'CART_ITEM_LIST', 'getAll').then($items => {  // ← LoD
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

    return cy.then(readExpected)
      .then(exp => readCart().then(actual => ({ exp, actual })))
      .then(({ exp, actual }) => {
        if (strictCount) expect(actual.length, 'cart items count').to.equal(exp.length)
        const norm = arr => arr.map(i => ({ t: i.title.trim(), p: +i.priceNumber }))
        const A = norm(actual), E = norm(exp)
        if (orderAgnostic) {
          const toKey = i => `${i.t}::${i.p}`
          expect(new Set(A.map(toKey))).to.deep.equal(new Set(E.map(toKey)))
        } else {
          expect(A).to.deep.equal(E)
        }
      })
  }
}
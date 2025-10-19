import { BaseTask } from '../../../common/tasks/baseTask.js'
/**
 * Add to cart all items whose title matches any of the provided titles.
 * Returns an array of { title, price, priceNumber } and optionally stores it as a Cypress alias.
 *
 * Usage:
 *   runTask('performAddItemsByTitle', {
 *     titles: ['Sauce Labs Backpack', 'Sauce Labs Bike Light'],
 *     partial: false,                 // optional: allow substring match
 *     caseInsensitive: true,          // optional
 *     storeAs: 'pickedItems'          // optional: cy.get('@pickedItems') to use later
 *   })
 */
export class PerformAddItemsByTitle extends BaseTask {
    /**
     * @param {import('../../../common/contracts/IUIContext').IUIContext} ctx
     * @param {{ titles: string[]; partial?: boolean; caseInsensitive?: boolean; storeAs?: string }} input
     */
    run(ctx, { titles, partial = false, caseInsensitive = true, storeAs } = {}) {
      if (!Array.isArray(titles) || titles.length === 0) {
        throw new Error('[performAddItemsByTitle] "titles" must be a non-empty array')
      }
  
      // Normalize the wanted titles into a fast lookup
      const norm = (s) => (caseInsensitive ? s.toLowerCase() : s)
      const wanted = partial
        ? titles.map(t => norm(t.trim()))
        : new Set(titles.map(t => norm(t.trim())))
  
      const match = (candidate) => {
        const c = norm(candidate.trim())
        if (partial) return wanted.some(w => c.includes(w))
        return wanted.has(c)
      }
  
      const collected = []
  
      // Resolve the card list selector from your locators
      return ctx.client.getSelector('inventory', 'INVENTORY_ITEM_LIST').then((cardSel) => {
        // Iterate every card and act if the title matches
        cy.get(cardSel).each(($card) => {
          const title = ($card.find('.inventory_item_name').text() || '').trim()
          if (!title || !match(title)) return
  
          const priceText = ($card.find('.inventory_item_price').text() || '').trim()
          const priceNumber = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0
  
          // click the "Add to cart" button inside the card
          cy.wrap($card).find('button').contains(/add to cart/i).click()
  
          collected.push({ title, price: priceText, priceNumber })
        })
        .then(() => {
          const wrapped = cy.wrap(collected, { log: true })
          if (storeAs) wrapped.as(storeAs)
          return wrapped
        })
      })
    }
  }  
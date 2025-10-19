import { BaseValidation } from '../../../common/validations/baseValidation.js'

/**
 * Compares the sum of picked items with Checkout Overview "Item total".
 *
 * input:
 *   - fromAlias?: string      // alias with items array [{ title, priceNumber }]
 *   - totalAlias?: string     // alias with numeric total (e.g., set earlier as @pickedTotal)
 *   - tolerance?: number      // float rounding tolerance, default 0.01
 *
 * Usage:
 *   runValidation('validateCheckoutItemSubtotalMatches', { fromAlias: 'pickedItems' })
 *   // or if you already stored the sum:
 *   runValidation('validateCheckoutItemSubtotalMatches', { totalAlias: 'pickedTotal' })
 */
export class ValidateCheckoutItemSubtotalMatches extends BaseValidation {
  check(ctx, { fromAlias, totalAlias, tolerance = 0.01 } = {}) {
    // 1) compute expected sum
    const readExpected = () => {
      if (totalAlias) {
        return cy.get(`@${totalAlias}`).then(v => Number(v) || 0)
      }
      if (fromAlias) {
        return cy.get(`@${fromAlias}`).then((items = []) =>
          (items || []).reduce((acc, it) => acc + (Number(it.priceNumber) || 0), 0)
        )
      }
      throw new Error('[validateCheckoutItemSubtotalMatches] Provide fromAlias or totalAlias')
    }

    // 2) read "Item total" from checkout overview
    const readItemSubtotal = () =>
      ctx.$loc.checkOutOverview.SUMMARY_INFO_LIST.getAll().then($box => {
        // in SauceDemo the subtotal element has class .summary_subtotal_label
        const text = Cypress.$($box).find('.summary_subtotal_label').text().trim()
        // e.g., "Item total: $39.98" → 39.98
        const num = parseFloat(text.replace(/[^0-9.]/g, '')) || 0
        return num
      })

    // 3) compare with tolerance
    return cy
      .then(readExpected)
      .then(expected =>
        readItemSubtotal().then(actual => {
          const diff = Math.abs(Number(expected) - Number(actual))
          // log for debugging
          cy.log(`Expected sum: ${expected.toFixed(2)} | UI item total: ${actual.toFixed(2)} | diff: ${diff}`)
          expect(diff, 'item total matches picked sum').to.be.lte(tolerance)
        })
      )
  }
}
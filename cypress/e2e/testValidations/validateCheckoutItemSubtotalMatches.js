import { BaseValidation } from '../../../common/validations/baseValidation.js'

export class ValidateCheckoutItemSubtotalMatches extends BaseValidation {
  check(ctx, { fromAlias, totalAlias, tolerance = 0.01 } = {}) {
    const readExpected = () => {
      if (totalAlias) return cy.get(`@${totalAlias}`).then(v => Number(v) || 0)
      if (fromAlias)  return cy.get(`@${fromAlias}`).then(items =>
        (items || []).reduce((acc, it) => acc + (Number(it.priceNumber) || 0), 0))
      throw new Error('[validateCheckoutItemSubtotalMatches] Provide fromAlias or totalAlias')
    }

    const readItemSubtotal = () =>
      ctx.ui.do('checkOutOverview', 'SUMMARY_INFO_LIST', 'getAll')   // ← LoD
        .then($box => {
          const text = Cypress.$($box).find('.summary_subtotal_label').text().trim()
          return parseFloat(text.replace(/[^0-9.]/g, '')) || 0
        })

    return cy.then(readExpected)
      .then(expected => readItemSubtotal().then(actual => {
        const diff = Math.abs(Number(expected) - Number(actual))
        cy.log(`Expected: ${expected.toFixed(2)} | UI: ${actual.toFixed(2)} | diff: ${diff}`)
        expect(diff, 'item total matches picked sum').to.be.lte(tolerance)
      }))
  }
}
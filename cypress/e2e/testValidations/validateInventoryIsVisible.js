import { BaseValidation } from '../../../common/validations/baseValidation.js'

export class ValidateInventoryIsVisible extends BaseValidation {
  check(ctx) {
    cy.location('pathname').should('include', '/inventory.html')
    return ctx.ui
      .do('inventory', 'INVENTORY_ITEM_LIST', 'getAll')  // ← LoD
      .should('have.length.greaterThan', 0)
  }
}
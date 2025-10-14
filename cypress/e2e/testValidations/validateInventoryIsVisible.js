import { BaseValidation } from '../../../common/validations/baseValidation.js'

export class ValidateInventoryIsVisible extends BaseValidation {
  /**
   * Verifies we are on /inventory.html and there is at least one item card.
   * Requires INVENTORY_ITEM_LIST in locators/inventory.json (e.g. ".inventory_item")
   * @param {import('../../../common/contracts/IUIContext').IUIContext} ctx
   */
  check(ctx) {
    // URL check
    cy.url().should('include', '/inventory.html')

    // Items exist (uses your getAll() action)
    return ctx.$loc.inventory.INVENTORY_ITEM_LIST
      .getAll()
      .should('have.length.greaterThan', 0)
  }
}

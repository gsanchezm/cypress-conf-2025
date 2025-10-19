import { BaseTask } from '../../../common/tasks/baseTask.js'

// Clicks the cart icon on the inventory page and waits for /cart.html
export class PerformOpenCart extends BaseTask{
    /**
     * @param {import('../../../common/contracts/IUIContext').IUIContext} ctx
     */
    run(ctx) {
      return cy.wrap(null)
        .then(() => ctx.$loc.inventory.SHOPING_CART_ICON.clickOnElement())
        .then(() => cy.location('pathname').should('include', '/cart.html'))
    }
  }
  
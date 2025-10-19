import { BaseTask } from '../../../common/tasks/baseTask.js'

export class PerformCheckout extends BaseTask{
    /**
     * @param {import('../../../common/contracts/IUIContext').IUIContext} ctx
     */
    run(ctx) {
      return cy.wrap(null)
        .then(() => ctx.ui.do('cart', 'CHECKOUT_BUTTON', 'clickOnElement'))
        // optional: SauceDemo step-one URL
        .then(() => cy.location('pathname').should('include', '/checkout-step-one.html'))
    }
  }  
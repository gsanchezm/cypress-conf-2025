import { BaseTask } from '../../../common/tasks/baseTask.js'

export class PerformFinishCheckout extends BaseTask{
    /**
     * Clicks Finish on checkout overview and asserts success page.
     * @param {import('../../../common/contracts/IUIContext').IUIContext} ctx
     */
    run(ctx) {
      return cy.wrap(null)
        .then(() => ctx.$loc.checkOutOverview.FINISH_BUTTON.clickOnElement())
        .then(() => cy.location('pathname').should('include', '/checkout-complete.html'))
    }
  }  
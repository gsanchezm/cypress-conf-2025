// cypress/e2e/testTasks/performFillCheckoutInfo.js
// Fills #first-name, #last-name, #postal-code and clicks Continue.

export class PerformFillCheckoutInfo {
    /**
     * @param {import('../../../common/contracts/IUIContext').IUIContext} ctx
     * @param {{ firstName?: string, lastName?: string, zip?: string, fromFixture?: { userKey: string } }} input
     *
     * If you pass { fromFixture: { userKey: 'standardUser' } } it will read
     * users.json → users.standardUser.checkout.{firstName,lastName,zip}
     */
    run(ctx, input = {}) {
      const loadFromFixture = () => {
        if (!input.fromFixture) return cy.wrap(null)
        const { userKey } = input.fromFixture
        if (!userKey) throw new Error('[performFillCheckoutInfo] fromFixture.userKey required')
        return cy.fixture('users').then(users => users[userKey]?.checkout || {})
      }
  
      return cy.then(loadFromFixture).then(fx => {
        const data = {
          firstName: input.firstName ?? fx?.firstName ?? '',
          lastName : input.lastName  ?? fx?.lastName  ?? '',
          zip      : input.zip       ?? fx?.zip       ?? ''
        }
  
        // Fill
        return cy
          .then(() => ctx.ui.do('checkOutUserInformation', 'FIRSTNAME_INPUT',  'typeIfNotEmpty', data.firstName))
          .then(() => ctx.ui.do('checkOutUserInformation', 'LASTNAME_INPUT',   'typeIfNotEmpty', data.lastName))
          .then(() => ctx.ui.do('checkOutUserInformation', 'ZIP_INPUT',        'typeIfNotEmpty', data.zip))
          .then(() => ctx.ui.do('checkOutUserInformation', 'CONTINUE_BUTTON',  'clickOnElement'))
          // Optional: assert we navigated to step two
          .then(() => cy.location('pathname').should('include', '/checkout-step-two.html'))
      })
    }
  }  
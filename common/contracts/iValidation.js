export class IValidation {
    /**
     * @param {import('./IUIContext').IUIContext} ctx
     * @param {any} input   // validation-specific data (e.g., expected text)
     * @returns {Cypress.Chainable}
     */
    check(_ctx, _input) { throw new Error('IValidation.check must be implemented') }
  }  
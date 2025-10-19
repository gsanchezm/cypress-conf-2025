// Strategy contract for selecting a menu item.
export class IMenuSelectStrategy {
    /**
     * @param {import('../contracts/IUIContext').IUIContext} ctx
     * @param {{ text?: string, index?: number }} input
     * @returns {Cypress.Chainable}
     */
    select(_ctx, _input) { throw new Error('IMenuSelectStrategy.select must be implemented') }
  }  
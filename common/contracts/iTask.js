export class ITask {
    /**
     * @param {import('./IUIContext').IUIContext} ctx
     * @param {any} input   // task-specific data (e.g., credentials)
     * @returns {Cypress.Chainable}
     */
    run(_ctx, _input) { throw new Error('ITask.run must be implemented') }
  }
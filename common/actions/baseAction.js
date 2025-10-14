export class BaseAction {
    // Subclasses must implement run(client, page, key, ...args) → Cypress.Chainable
    run() { throw new Error('BaseAction.run() must be implemented') }
}  
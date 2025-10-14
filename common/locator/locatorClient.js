import pino from 'pino'

export class LocatorClient {
  constructor({ platform, logger } = {}) {
    this.platform = (platform || Cypress.env('PLATFORM') || 'DESKTOP').toUpperCase()
    this.logger = logger || pino({ level: Cypress.env('LOG_LEVEL') || 'info', browser: { asObject: true } })
  }

  getSelector(page, key) {
    const payload = { page, key, platform: this.platform }
    this.logger.debug({ payload }, '[LocatorClient] resolve selector')
    return cy.task('loc:resolve', payload) // Chainable<string>
  }

  get(page, key, options) {
    return this.getSelector(page, key).then((sel) => cy.get(sel, options))
  }
}
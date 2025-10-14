// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import pino from 'pino'

const logger = pino({ level: Cypress.env('LOG_LEVEL') || 'info', browser: { asObject: true } })
Cypress.once('test:before:run', () => {
  logger.info({ platform: Cypress.env('PLATFORM') }, 'Starting Cypress tests')
})
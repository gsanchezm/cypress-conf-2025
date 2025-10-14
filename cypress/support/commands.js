// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import { createTestKernel } from '../../cypress/factory/createTestKernel.js'

// Build the kernel once (actions + $loc + registries)
const kernel = createTestKernel()
const { $loc, client, actions, tasks, validations } = kernel

// ⬇️ export REAL functions your specs can import and call
export const runTask = (name, input) => kernel.runTask(name, input)
export const runValidation = (name, input) => kernel.runValidation(name, input)
export { $loc, client as locatorClient, actions, tasks, validations }

// (optional) still keep a generic selector helper
Cypress.Commands.add('sel', (a, b, options) => {
  const [page, key] = b ? [a, b] : String(a).split(':')
  return client.get(page, key, options)
})

// (optional) banner helper using the client
Cypress.Commands.add('dismissKnownBanners', () =>
  client.dismissIfVisible('dashboard', 'SMART_BANNER')
)
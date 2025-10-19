import pino from 'pino'
import { createLocatorProxy } from './createLocatorProxy.js'

import { TaskRegistry } from '../tasks/taskRegistry.js'
import { ValidationRegistry } from '../validations/validationRegistry.js'

import { registerAllTestTasks } from '../../cypress/.generated/tasks.generated.js'
import { registerAllTestValidations } from '../../cypress/.generated/validations.generated.js'

/**
 * Build the test kernel with Dependency Inversion:
 * - Specs should call runTask('name') / runValidation('name'), not concrete classes.
 * - Tasks/Validations are discovered and registered automatically from folders.
 *
 * @param {object} [opts]
 * @returns {{
 *   ctx: import('../contracts/IUIContext').IUIContext,
 *   $loc: any,
 *   client: import('../../locator/locatorClient.js').LocatorClient,
 *   actions: import('../actions/ActionRegistry.js').ActionRegistry,
 *   tasks: import('../tasks/taskRegistry.js').TaskRegistry,
 *   validations: import('../validations/validationRegistry.js').ValidationRegistry,
 *   runTask: (name: string, input?: any) => Cypress.Chainable,
 *   runValidation: (name: string, input?: any) => Cypress.Chainable
 * }}
 */
export function createTestKernel(opts = {}) {
  const logger = pino({
    level: Cypress.env('LOG_LEVEL') || 'info',
    browser: { asObject: true },
  })

  // Base UI plumbling: locator client + $loc proxy + action registry
  const { $loc, client, ui, registry: actions } = createLocatorProxy(opts)

  /** @type {import('../contracts/IUIContext').IUIContext} */
  const ctx = {
    client,
    actions,
    $loc,
    ui,
    info: (msg, meta) => logger.info(meta || {}, msg),
    debug: (msg, meta) => logger.debug(meta || {}, msg),
    error: (msg, meta) => logger.error(meta || {}, msg),
  }

  // Build registries and auto-register everything discovered at boot
  const tasks = new TaskRegistry()
  registerAllTestTasks(tasks)

  const validations = new ValidationRegistry()
  registerAllTestValidations(validations)

  // Helpers (DIP): specs run by name, not by class
  const runTask = (name, input) => tasks.create(name).run(ctx, input)
  const runValidation = (name, input) => validations.create(name).check(ctx, input)

  return { ctx, $loc, client, actions, ui, tasks, validations, runTask, runValidation }
}
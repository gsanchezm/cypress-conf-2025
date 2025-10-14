import { BaseTask } from '../../../common/tasks/baseTask.js'

/** Fill login form and submit (SauceDemo). */
export class PerformLogin extends BaseTask {
  /**
   * @param {IUIContext} ctx
   * @param {{ username: string, password: string }} input
   */
  run(ctx, { username, password }) {
    ctx.info('Performing login', { username })
    return cy.wrap(null)
      .then(() => ctx.$loc.signIn.USERNAME_INPUT.typeIfNotEmpty(username))
      .then(() => ctx.$loc.signIn.PASSWORD_INPUT.typeIfNotEmpty(password))
      .then(() => ctx.$loc.signIn.LOGIN_BUTTON.clickOnElement())
  }
}
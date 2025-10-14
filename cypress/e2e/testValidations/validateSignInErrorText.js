import { BaseValidation } from '../../../common/validations/baseValidation.js'

/** Assert the error label contains expected text on signIn page. */
export class ValidateSignInErrorText extends BaseValidation {
  /**
   * @param {IUIContext} ctx
   * @param {{ expected: string }} input
   */
  check(ctx, { expected }) {
    ctx.info('Validating sign in error text', { expected })
    // Uses OCP action getText (already created)
    return ctx.$loc.signIn.ERROR_LABEL.getText().then((txt) => {
      expect(txt).to.contain(expected)
    })
  }
}
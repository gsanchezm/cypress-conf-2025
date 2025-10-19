import { BaseValidation } from '../../../common/validations/baseValidation.js'

export class ValidateSignInErrorText extends BaseValidation {
  check(ctx, { expected }) {
    ctx.info('Validating sign in error text', { expected })
    return ctx.ui
      .do('signIn', 'ERROR_LABEL', 'getText')            // ← LoD
      .then(txt => expect(txt).to.contain(expected))
  }
}
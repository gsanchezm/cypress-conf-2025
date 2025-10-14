import { BaseAction } from './baseAction.js'

export class CheckIfUnchecked extends BaseAction {
  run(client, page, key) {
    return client.getSelector(page, key).then((sel) =>
      cy.get(sel).then(($cb) => {
        if (!$cb.is(':checked')) cy.wrap($cb).check()
      })
    )
  }
}
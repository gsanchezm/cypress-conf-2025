import { BaseAction } from './baseAction.js'

export class GetText extends BaseAction {
  run(client, page, key) {
    return client.getSelector(page, key)
      .then((sel) => cy.get(sel))
      .then(($el) => $el.text().trim())
  }
}
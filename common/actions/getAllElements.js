import { BaseAction } from './baseAction.js'

export class GetAllElements extends BaseAction {
  run(client, page, key, options) {
    return client.getSelector(page, key).then((sel) => cy.get(sel, options))
  }
}

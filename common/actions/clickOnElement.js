import { BaseAction } from './baseAction.js'

export class ClickOnElement extends BaseAction {
  run(client, page, key) {
    return client.getSelector(page, key)
      .then((sel) => cy.get(sel).should('be.visible').click())
  }
}
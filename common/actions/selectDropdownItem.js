import { BaseAction } from './baseAction.js'

export class SelectDropdownItem extends BaseAction {
  run(client, page, key, visibleText) {
    return client.getSelector(page, key).then((sel) =>
      cy.get(sel).should('be.visible').then(($dd) => cy.wrap($dd).select(visibleText))
    )
  }
}
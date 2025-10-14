import { BaseAction } from './baseAction.js'
import { recurse } from 'cypress-recurse'

export class TypeIfNotEmpty extends BaseAction {
  run(client, page, key, text, { delay = 1000, timeout = 5000 } = {}) {
    if (!text || !text.trim()) return cy.wrap(null) // no-op
    return client.getSelector(page, key).then((sel) =>
      recurse(
        () => cy.get(sel).should('be.visible').clear().type(text),
        ($input) => $input.val() === text,
        { delay, timeout }
      )
    )
  }
}
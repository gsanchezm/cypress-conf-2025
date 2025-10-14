import { BaseAction } from './baseAction.js'

export class WaitUntilNotVisible extends BaseAction {
  run(client, page, key, { timeout = 5000 } = {}) {
    return client.getSelector(page, key).then((sel) =>
      cy.get('body').then(($body) => {
        const $el = $body.find(sel)
        if ($el.length > 0) {
          cy.get(sel, { timeout }).should('not.be.visible')
        } else {
          cy.log(`Element ${sel} does not exist. Continuing...`)
        }
      })
    )
  }
}
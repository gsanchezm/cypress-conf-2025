import { BaseAction } from './baseAction.js'

export class ClickUntilVisible extends BaseAction {
  run(client, page, key, targetSelector, { retries = 5, delay = 500 } = {}) {
    const loop = (n) => {
      if (n <= 0) throw new Error(`Target ${targetSelector} not visible after retries`)
      return client.getSelector(page, key).then((sel) =>
        cy.get(sel).click({ force: true }).then(() =>
          cy.get('body').then(($b) => {
            if ($b.find(targetSelector).length) {
              cy.get(targetSelector).should('be.visible')
            } else {
              cy.wait(delay); return loop(n - 1)
            }
          })
        )
      )
    }
    return loop(retries)
  }
}
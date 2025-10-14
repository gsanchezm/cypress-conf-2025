import { BaseAction } from './baseAction.js'

/**
 * Clicks resolved element until targetSelector is visible (or retries exhausted).
 * Usage: $loc.page.KEY.clickUntilVisible('.target', { retries: 5, delay: 500 })
 */
export class ClickUntilVisible extends BaseAction {
  run(client, page, key, targetSelector, { retries = 5, delay = 500 } = {}) {
    const loop = (n) => {
      if (n <= 0) throw new Error(`Failed to find ${targetSelector} after multiple attempts`)
      return client.getSelector(page, key).then((sel) =>
        cy.get(sel).click({ force: true }).then(() =>
          cy.get('body').then(($body) => {
            if ($body.find(targetSelector).length === 0) {
              cy.wait(delay)
              return loop(n - 1)
            }
            return cy.get(targetSelector).should('be.visible')
          })
        )
      )
    }
    return loop(retries)
  }
}
import { BaseAction } from './baseAction.js'

export class IsElementVisible extends BaseAction {
  run(client, page, key, { timeout = 10000 } = {}) {
    return client.getSelector(page, key).then((sel) =>
      cy.get('body', { timeout }).then(($body) => {
        const $el = $body.find(sel)
        const visible = $el.length > 0 && $el.is(':visible')
        if (!visible) cy.log(`${sel} not visible or doesn't exist.`)
        return visible
      })
    )
  }
}
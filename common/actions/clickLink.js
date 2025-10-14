import { BaseAction } from './baseAction.js'

/** Clicks an <a> anywhere by visible label (ignores page/key). */
export class ClickLink extends BaseAction {
  run(_client, _page, _key, label) {
    return cy.get('a').contains(label).click()
  }
}
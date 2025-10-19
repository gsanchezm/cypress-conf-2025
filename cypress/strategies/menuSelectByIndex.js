import { IMenuSelectStrategy } from '../contracts/iMenuSelectStrategy.js'

export class MenuSelectByIndex extends IMenuSelectStrategy {
  select(ctx, { index = 0, timeout = 6000 }) {
    ctx.ui.do('inventory', 'HAMBURGER_BUTTON', 'clickOnElement')     // ← LoD
    return ctx.client.getSelector('menu', 'NAV_LIST').then(sel => {
      cy.get(sel, { timeout }).should('be.visible').eq(index).click()
    })
  }
}
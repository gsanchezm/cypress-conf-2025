import { IMenuSelectStrategy } from '../contracts/iMenuSelectStrategy'

export class MenuSelectByText extends IMenuSelectStrategy {
  select(ctx, { text, caseInsensitive = true, partial = false, timeout = 6000 }) {
    if (!text?.trim()) throw new Error('[MenuSelectByText] "text" required')
    ctx.ui.do('inventory', 'HAMBURGER_BUTTON', 'clickOnElement')     // ← LoD
    return ctx.client.getSelector('menu', 'NAV_LIST').then(sel => {
      cy.get(sel, { timeout }).should('be.visible')
      const esc = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const re = partial ? new RegExp(esc, caseInsensitive ? 'i' : '')
                         : new RegExp(`^\\s*${esc}\\s*$`, caseInsensitive ? 'i' : '')
      cy.contains(sel, re).click()
    })
  }
}
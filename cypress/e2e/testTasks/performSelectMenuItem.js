import { BaseTask } from '../../../common/tasks/baseTask.js'

export class PerformSelectMenuItem extends BaseTask{
    /**
     * Clicks the hamburger button, then selects a menu item by its visible text.
     * @param {import('../../../common/contracts/IUIContext').IUIContext} ctx
     * @param {{ text: string, partial?: boolean, caseInsensitive?: boolean, timeout?: number }} input
     */
    run(ctx, { text, partial = false, caseInsensitive = true, timeout = 6000 }) {
      if (!text || !text.trim()) {
        throw new Error('[performSelectMenuItem] "text" is required')
      }
  
      // 1) Open the left menu from inventory page
      //    (uses your action ClickOnElement → should('be.visible').click())
      ctx.ui.do('inventory', 'HAMBURGER_BUTTON', 'clickOnElement')
  
      // 2) Wait until the menu options are visible
      return ctx.client.getSelector('menu', 'NAV_LIST').then((sel) => {
        cy.get(sel, { timeout }).should('be.visible')
  
        // 3) Build a matcher for cy.contains
        const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const pattern = partial
          ? new RegExp(escaped, caseInsensitive ? 'i' : '')
          : new RegExp(`^\\s*${escaped}\\s*$`, caseInsensitive ? 'i' : '')
  
        // 4) Click the targeted item
        cy.contains(sel, pattern).click()
      })
    }
  }  
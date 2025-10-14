import { BaseAction } from './baseAction.js'

export class SelectRadioButton extends BaseAction {
  // Si selector de inputs está en page:key, busca la opción por value o label
  run(client, page, key, option, selectorOverride) {
    return client.getSelector(page, key).then((baseSel) => {
      const sel = selectorOverride || baseSel // permite pasar 'input[type="radio"]'
      return cy.get(sel).each(($el) => {
        const value = $el.val()
        const label = $el.next('label').text().trim()
        if (value === option || label === option) cy.wrap($el).check()
      })
    })
  }
}
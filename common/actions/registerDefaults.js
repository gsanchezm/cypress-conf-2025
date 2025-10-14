import { ActionRegistry } from './actionRegistry.js'

import { GetText } from './getText.js'
import { CheckIfUnchecked } from './checkIfUnchecked.js'
import { TypeIfNotEmpty } from './typeIfNotEmpty.js'
import { ClickLink } from './clickLink.js'
import { ClickOnElement } from './clickOnElement.js'
import { ClickUntilVisible } from './clickUntilVisible.js'
import { SelectDropdownItem } from './selectDropdownItem.js'
import { IsElementVisible } from './isElementVisible.js'
import { WaitUntilNotVisible } from './waitUntilNotVisible.js'
import { SelectRadioButton } from './selectRadioButton.js'
import { GetAllElements } from './getAllElements.js'

export function registerDefaultActions(registry = new ActionRegistry()) {
  return registry
    .register('getText', GetText)
    .register('checkIfUnchecked', CheckIfUnchecked)
    .register('typeIfNotEmpty', TypeIfNotEmpty)
    .register('clickLink', ClickLink)
    .register('clickOnElement', ClickOnElement)
    .register('clickUntilVisible', ClickUntilVisible)
    .register('selectDropdownItem', SelectDropdownItem)
    .register('isElementVisible', IsElementVisible)
    .register('waitUntilNotVisible', WaitUntilNotVisible)
    .register('selectRadioButton', SelectRadioButton)
    .register('getAll', GetAllElements)
}
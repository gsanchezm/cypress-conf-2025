import { UIFacade } from '../ui/uIFacade.js'
import { LocatorClient } from '../locator/locatorClient.js'
import { LocatorPageProxy } from '../locator/locatorPageProxy.js'
import { registerDefaultActions } from '../actions/registerDefaults.js'

export function createLocatorProxy(opts = {}) {
  const client = new LocatorClient(opts)
  const registry = registerDefaultActions()
  const $loc = new LocatorPageProxy(client, registry)
  const ui = new UIFacade({ client, $loc, actions: registry }) // ← inject actions
  return { $loc, client, registry, ui }
}
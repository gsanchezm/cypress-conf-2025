import { LocatorClient } from '../locator/locatorClient.js'
import { LocatorPageProxy } from '../locator/locatorPageProxy.js'
import { registerDefaultActions } from '../actions/registerDefaults.js'

export function createLocatorProxy(opts = {}) {
  const client = new LocatorClient(opts)
  const registry = registerDefaultActions()
  const $loc = new LocatorPageProxy(client, registry)
  return { $loc, client, registry }
}

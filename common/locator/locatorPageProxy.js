// locator/locatorPageProxy.js
// Creates $loc.page.KEY.<action>() based on the registry—no hardcoded methods.

export class LocatorPageProxy {
  /**
   * @param {import('./locatorClient').LocatorClient} client
   * @param {import('../common/actions/ActionRegistry').ActionRegistry} registry
   */
  constructor(client, registry) {
    this.client = client
    this.registry = registry

    return new Proxy({}, {
      get: (_t, page) => {
        if (page === 'raw') {
          return (id) => {
            const [p, k] = String(id).split(':')
            return this.client.getSelector(p, k) // Chainable<string>
          }
        }
        return new Proxy({}, {
          get: (_t2, key) => this.createActionHandle(String(page), String(key)),
        })
      },
    })
  }

  createActionHandle(page, key) {
    const handle = {
      resolve: () => this.client.getSelector(page, key),
      do: (actionName, ...args) => {
        const A = this.registry.get(actionName)
        return new A().run(this.client, page, key, ...args)
      },
    }

    // Sugar: expose every registered action as a method
    for (const name of this.registry.names()) {
      handle[name] = (...args) => handle.do(name, ...args)
    }
    return handle
  }
}
// common/ui/UIFacade.js
// Law of Demeter-friendly facade that *dispatches* to registered actions.

export class UIFacade {
    /**
     * @param {{ client:any, $loc:any, actions: import('../actions/ActionRegistry').ActionRegistry }} deps
     */
    constructor({ client, $loc, actions }) {
      this.client = client
      this.$loc = $loc
      this.actions = actions
    }
  
    /** Generic dispatcher: run any registered action by name */
    do(page, key, actionName, ...args) {
      const A = this.actions.get(actionName)                        // :contentReference[oaicite:0]{index=0}
      return new A().run(this.client, page, key, ...args)           // :contentReference[oaicite:1]{index=1}
    }
  }  
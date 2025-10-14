export class ActionRegistry {
    constructor() { this.map = new Map() }
    register(name, actionClass) { this.map.set(name, actionClass); return this }
    get(name) {
      const A = this.map.get(name)
      if (!A) throw new Error(`[ActionRegistry] Unknown action: ${name}`)
      return A
    }
    names() { return Array.from(this.map.keys()) }
  }  
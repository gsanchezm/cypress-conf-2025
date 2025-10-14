export class ValidationRegistry {
    constructor() { this.map = new Map() }
    register(name, Cls) { this.map.set(name, Cls); return this }
    has(name) { return this.map.has(name) }
    create(name) {
      const Cls = this.map.get(name)
      if (!Cls) throw new Error(`[ValidationRegistry] Unknown validation: ${name}`)
      return new Cls()
    }
  }  
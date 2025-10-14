const fs = require('fs')
const path = require('path')

class RegisterGenerator {
  /**
   * @param {object} opt
   * @param {string[]} [opt.extensions] file extensions to include
   * @param {'fileName'|'exportName'} [opt.keyStrategy]
   */
  constructor({ extensions = ['.js'], keyStrategy = 'fileName' } = {}) {
    this.extensions = new Set(extensions)
    this.keyStrategy = keyStrategy
  }

  generate({ globRoot, outFile, exportFnName }) {
    const files = this.walk(globRoot)
      .filter(f => this.extensions.has(path.extname(f)))
      .sort()

    const rows = files.map((abs, i) => {
      const rel = this.toPosix(path.relative(path.dirname(outFile), abs))
      const spec = rel.startsWith('.') ? rel : `./${rel}`
      const varName = `m${i}`
      const base = path.basename(abs, path.extname(abs)) // e.g. performLogin
      return { spec, varName, base }
    })

    const imports = rows.map(r => `import * as ${r.varName} from '${r.spec}';`).join('\n')

    // filename → camelCase helper
    const helpers = `
function toLowerCamel(s){
  return s
    .replace(/[-_\\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, (c) => c.toLowerCase())
}
`.trim()

    // registration body
    const bodyRows = rows.map(r => {
      if (this.keyStrategy === 'exportName') {
        return `
  for (const [exportName, exported] of Object.entries(${r.varName})) {
    if (typeof exported !== 'function') continue
    const key = exportName === 'default' ? toLowerCamel('${r.base}') : toLowerCamel(exportName)
    registry.register(key, exported)
  }`.trim()
      }
      // default: fileName
      return `
  for (const [exportName, exported] of Object.entries(${r.varName})) {
    if (typeof exported !== 'function') continue
    const key = exportName === 'default' ? toLowerCamel('${r.base}') : toLowerCamel(exportName)
    registry.register(key, exported)
  }`.trim()
    }).join('\n')

    const out = `
${imports}

${helpers}

export function ${exportFnName}(registry){
${bodyRows}
}
`.trim()

    fs.mkdirSync(path.dirname(outFile), { recursive: true })
    fs.writeFileSync(outFile, out, 'utf8')
  }

  walk(dir) {
    const out = []
    if (!fs.existsSync(dir)) return out
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name)
      if (entry.isDirectory()) out.push(...this.walk(p))
      else out.push(p)
    }
    return out
  }

  toPosix(p) { return p.split(path.sep).join('/') }
}

module.exports = { RegisterGenerator }
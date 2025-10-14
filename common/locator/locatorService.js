const fs = require('fs')
const path = require('path')

class LocatorService {
  /**
   * @param {object} opts
   * @param {string} opts.locatorsDir absolute or relative path to /locators
   * @param {object} [opts.logger] pino-like logger ({info,debug,error})
   */
  constructor({ locatorsDir, logger }) {
    this.locatorsDir = path.resolve(locatorsDir || './locators')
    this.logger = logger || { info(){}, debug(){}, error(){} }
    // cache: page -> { json, mtimeMs }
    this.cache = new Map()
  }

  /** Load and cache a single page JSON (by name, without .json) */
  loadPage(page) {
    const file = path.join(this.locatorsDir, `${page}.json`)
    if (!fs.existsSync(file)) {
      throw new Error(`[LocatorService] File not found: ${file}`)
    }

    const stat = fs.statSync(file)
    const cached = this.cache.get(page)
    if (cached && cached.mtimeMs === stat.mtimeMs) {
      return cached.json
    }

    const json = JSON.parse(fs.readFileSync(file, 'utf8'))
    this.cache.set(page, { json, mtimeMs: stat.mtimeMs })
    this.logger.debug?.({ page, file }, 'Loaded locator page')
    return json
  }

  /**
   * Resolve a selector for {page, key, platform}
   * Supports: 
   *   { "web": "<css>" } or
   *   { "web": { "DESKTOP": "...", "RESPONSIVE": "..." } }
   */
  resolveSelector({ page, key, platform = 'DESKTOP' }) {
    const pageJson = this.loadPage(page)
    const entry = pageJson[key]
    if (!entry) {
      throw new Error(`[LocatorService] Missing key '${key}' in page '${page}'`)
    }

    const web = entry.web ?? entry
    let sel
    if (typeof web === 'string') {
      sel = web
    } else if (web && typeof web === 'object') {
      sel = web[platform] || web.DESKTOP || web.RESPONSIVE || Object.values(web)[0]
    }

    if (!sel) {
      throw new Error(`[LocatorService] Invalid format for ${page}:${key}`)
    }

    this.logger.debug?.({ page, key, platform, sel }, 'Resolved selector')
    return sel
  }

  /** Optional: clear cache (e.g., in watch mode) */
  clearCache() {
    this.cache.clear()
  }
}

module.exports = { LocatorService }
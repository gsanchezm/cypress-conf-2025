import { MenuSelectByText } from '../../strategies/menuSelectByText.js'
import { MenuSelectByIndex } from '../../strategies/menuSelectByIndex.js'

export class PerformOpenMenuWithStrategy {
  /**
   * @param {import('../../../common/contracts/IUIContext').IUIContext} ctx
   * @param {{ mode?: 'text'|'index', text?: string, index?: number }} input
   */
  run(ctx, { mode = 'text', ...rest } = {}) {
    const strategy = mode === 'index' ? new MenuSelectByIndex() : new MenuSelectByText()
    return strategy.select(ctx, rest)
  }
}
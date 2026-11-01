/** localStorage 存档键（v2 为新版 React 存档结构） */
export const SAVE_KEY = 'ancient-war-card-save-v2'

/** 国力初始值 */
export const START_VALUE = 50

/** 国力上限，超过即亡国 */
export const MAX_VALUE = 100

/** 事件纪事最多保留条数 */
export const LOG_LIMIT = 50

/** 卡牌飞出动画时长（毫秒） */
export const CARD_EXIT_MS = 260

/** 一次选择期间锁定输入的时长（毫秒） */
export const CARD_LOCK_MS = CARD_EXIT_MS + 60

/** @type {import('../data/cards.js').StatKey[]} */
export const STAT_KEYS = ['military', 'food', 'people', 'treasury']

/** @type {Record<import('../data/cards.js').StatKey, string>} */
export const STAT_NAMES = {
  military: '兵力',
  food: '粮草',
  people: '民心',
  treasury: '国库',
}

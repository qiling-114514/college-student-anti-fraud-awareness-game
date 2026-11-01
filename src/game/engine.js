import { CARDS, getCard } from '../data/cards.js'
import {
  LOG_LIMIT,
  MAX_VALUE,
  START_VALUE,
  STAT_KEYS,
  STAT_NAMES,
} from './constants.js'

/**
 * 洗牌（Fisher–Yates），返回新数组。
 * @template T
 * @param {T[]} list
 * @returns {T[]}
 */
export function shuffle(list) {
  const next = list.slice()
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  return next
}

/** @returns {number[]} 一副洗好的牌（只存 id） */
export function createDeck() {
  return shuffle(CARDS.map((card) => card.id))
}

/**
 * 从牌堆抽一张。牌堆耗尽时自动重洗，并避免与上一张重复。
 * @param {number[]} deck
 * @param {number | null} lastCardId
 * @returns {{ deck: number[], currentCardId: number, lastCardId: number }}
 */
export function drawCard(deck, lastCardId) {
  let nextDeck = deck.slice()

  if (nextDeck.length === 0) {
    nextDeck = createDeck()
    const last = nextDeck.length - 1
    if (nextDeck.length > 1 && nextDeck[last] === lastCardId) {
      const swap = Math.floor(Math.random() * (nextDeck.length - 1))
      ;[nextDeck[last], nextDeck[swap]] = [nextDeck[swap], nextDeck[last]]
    }
  }

  const currentCardId = nextDeck.pop()
  return { deck: nextDeck, currentCardId, lastCardId: currentCardId }
}

/**
 * @param {Record<import('../data/cards.js').StatKey, number>} stats
 * @param {import('../data/cards.js').StatEffects} effects
 */
export function applyEffects(stats, effects) {
  const next = { ...stats }
  for (const key of STAT_KEYS) {
    if (effects[key]) next[key] += effects[key]
  }
  return next
}

/**
 * 返回第一个崩溃的国力项（<= 0 或 > 100），无则返回 null。
 * @param {Record<import('../data/cards.js').StatKey, number>} stats
 * @returns {import('../data/cards.js').StatKey | null}
 */
export function findBrokenStat(stats) {
  return STAT_KEYS.find((key) => stats[key] <= 0 || stats[key] > MAX_VALUE) ?? null
}

/**
 * @param {import('../data/cards.js').StatKey} statKey
 * @param {number} value
 */
export function describeFailure(statKey, value) {
  const name = STAT_NAMES[statKey]
  if (value <= 0) return `${name}已耗尽（当前 ${value}）`
  return `${name}过于充盈（当前 ${value}，超过上限 ${MAX_VALUE}）`
}

/**
 * 创建一个新对局（已抽好第一张牌）。
 * @param {{ gameId?: number }} [options]
 */
export function createGame({ gameId = 1 } = {}) {
  const drawn = drawCard(createDeck(), null)
  return {
    gameId,
    stats: {
      military: START_VALUE,
      food: START_VALUE,
      people: START_VALUE,
      treasury: START_VALUE,
    },
    turn: 1,
    ...drawn,
    ended: false,
    failStat: null,
    failReason: '',
    log: [],
  }
}

/**
 * 纯函数：处理一次选择，返回新的对局状态。
 * @param {ReturnType<typeof createGame>} state
 * @param {'left' | 'right'} side
 */
export function resolveChoice(state, side) {
  if (state.ended || state.currentCardId == null) return state

  const card = getCard(state.currentCardId)
  if (!card) return state

  const choice = side === 'left' ? card.left : card.right
  const stats = applyEffects(state.stats, choice.effects)
  const log = [
    {
      turn: state.turn,
      cardId: card.id,
      title: card.title,
      label: choice.label,
      side,
      effects: choice.effects,
    },
    ...state.log,
  ].slice(0, LOG_LIMIT)

  const failStat = findBrokenStat(stats)
  if (failStat) {
    return {
      ...state,
      stats,
      log,
      ended: true,
      failStat,
      failReason: describeFailure(failStat, stats[failStat]),
    }
  }

  return {
    ...state,
    stats,
    log,
    turn: state.turn + 1,
    ...drawCard(state.deck, state.lastCardId),
  }
}

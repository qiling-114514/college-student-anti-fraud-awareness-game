import { STAT_KEYS, STAT_NAMES } from '../game/constants.js'

/**
 * 把一次选择的影响渲染成「兵力+12、民心-8」。
 * @param {{ effects: import('../data/cards.js').StatEffects }} props
 */
export default function EffectDelta({ effects }) {
  const changedKeys = STAT_KEYS.filter((key) => effects[key])
  if (changedKeys.length === 0) return null

  return (
    <span className="log-delta">
      {changedKeys.map((key, index) => {
        const delta = effects[key]
        return (
          <span key={key}>
            {index > 0 && '、'}
            {STAT_NAMES[key]}
            <span className={delta > 0 ? 'up' : 'down'}>
              {delta > 0 ? `+${delta}` : delta}
            </span>
          </span>
        )
      })}
    </span>
  )
}

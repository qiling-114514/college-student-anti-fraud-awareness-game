import StatBar from './StatBar.jsx'
import { STAT_KEYS } from '../game/constants.js'

/**
 * 四项国力面板。
 * @param {{ stats: Record<import('../data/cards.js').StatKey, number> }} props
 */
export default function StatsPanel({ stats }) {
  return (
    <section className="stats-grid" aria-label="国家数值">
      {STAT_KEYS.map((statKey) => (
        <StatBar key={statKey} statKey={statKey} value={stats[statKey]} />
      ))}
    </section>
  )
}

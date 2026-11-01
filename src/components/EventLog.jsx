import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import EffectDelta from './EffectDelta.jsx'

/**
 * 事件纪事：每回合一条，最新在最上方。
 * @param {{ entries: Array<{
 *   turn: number,
 *   cardId: number,
 *   title: string,
 *   label: string,
 *   side: 'left' | 'right',
 *   effects: import('../data/cards.js').StatEffects,
 * }> }} props
 */
export default function EventLog({ entries }) {
  const listRef = useRef(null)
  const newestTurn = entries[0]?.turn

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = 0
  }, [entries.length, newestTurn])

  return (
    <section className="log-section">
      <div className="log-head">事件纪事</div>
      <div className="event-log" ref={listRef} aria-label="事件纪事">
        {entries.length === 0 ? (
          <div className="log-empty">尚无异动，江山初定。</div>
        ) : (
          entries.map((entry) => (
            <motion.div
              key={`${entry.turn}-${entry.cardId}`}
              className="log-item"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <span className="log-turn">第{entry.turn}回合</span>
              <span className="log-title">{entry.title}</span>
              <span className="log-choice">「{entry.label}」</span>
              <EffectDelta effects={entry.effects} />
            </motion.div>
          ))
        )}
      </div>
    </section>
  )
}

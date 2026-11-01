import clsx from 'clsx'
import { motion } from 'framer-motion'
import AnimatedNumber from './AnimatedNumber.jsx'
import { MAX_VALUE, STAT_NAMES } from '../game/constants.js'

/**
 * 单条国力：名称 + 数值 + 进度条。
 * @param {{ statKey: import('../data/cards.js').StatKey, value: number }} props
 */
export default function StatBar({ statKey, value }) {
  const width = `${Math.max(0, Math.min(MAX_VALUE, value))}%`

  return (
    <div className={clsx('stat', `stat-${statKey}`)}>
      <div className="stat-top">
        <span className="stat-name">{STAT_NAMES[statKey]}</span>
        <AnimatedNumber className="stat-value" value={value} />
      </div>
      <div className="stat-track">
        <motion.div
          className="stat-fill"
          initial={false}
          animate={{ width }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

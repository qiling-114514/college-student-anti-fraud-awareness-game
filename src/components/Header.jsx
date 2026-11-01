import { motion } from 'framer-motion'

/**
 * 顶部：品牌、回合数、重开按钮。
 * @param {{ turn: number, onRestart: () => void }} props
 */
export default function Header({ turn, onRestart }) {
  return (
    <header className="app-header">
      <div className="brand">
        <h1>古代战局</h1>
        <span className="tagline">王权 · 抉择</span>
      </div>

      <div className="header-right">
        <div className="turn-pill">
          第{' '}
          <motion.b
            key={turn}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {turn}
          </motion.b>{' '}
          回合
        </div>
        <button className="btn-mini" type="button" onClick={onRestart}>
          重新开始
        </button>
      </div>
    </header>
  )
}

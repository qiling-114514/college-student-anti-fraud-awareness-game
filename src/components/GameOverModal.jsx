import { AnimatePresence, motion } from 'framer-motion'

/**
 * 王朝覆灭弹窗。
 * @param {{ open: boolean, reason: string, turn: number, onRestart: () => void }} props
 */
export default function GameOverModal({ open, reason, turn, onRestart }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="fail-title"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 240, damping: 22 }}
          >
            <h2 id="fail-title">王朝覆灭</h2>
            <p className="fail-text">失败原因：{reason}</p>
            <p className="turn-result">你共治理了 {turn} 个回合</p>
            <button className="btn-main" type="button" autoFocus onClick={onRestart}>
              重新开始
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

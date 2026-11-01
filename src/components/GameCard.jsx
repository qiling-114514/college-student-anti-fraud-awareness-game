import { animate, motion, useMotionValue, useTransform } from 'framer-motion'

/** 卡牌整张的入场 / 退场动画 */
const cardVariants = {
  enter: (direction) => ({
    x: direction === 0 ? 0 : `${-direction * 120}%`,
    rotate: direction === 0 ? 0 : -direction * 16,
    opacity: 0,
    scale: direction === 0 ? 0.98 : 1,
  }),
  center: {
    x: 0,
    rotate: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
  exit: (direction) => ({
    x: `${direction * 130}%`,
    rotate: direction * 18,
    opacity: 0,
    transition: { duration: 0.26, ease: 'easeIn' },
  }),
}

function swipeThreshold() {
  return Math.min(90, window.innerWidth * 0.16)
}

/**
 * 事件卡：支持拖拽 / 滑动选择，左右两侧也会浮现提示。
 * @param {{
 *   card: import('../data/cards.js').GameCardData,
 *   direction: number,
 *   disabled: boolean,
 *   onChoose: (side: 'left' | 'right') => void,
 * }} props
 */
export default function GameCard({ card, direction, disabled, onChoose }) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-240, 0, 240], [-16, 0, 16])
  const leftHintOpacity = useTransform(x, [-180, -60, 0], [1, 0.25, 0])
  const rightHintOpacity = useTransform(x, [0, 60, 180], [0, 0.25, 1])

  const handleDragEnd = (_event, info) => {
    const power = info.offset.x + info.velocity.x * 0.15
    const threshold = swipeThreshold()

    if (power <= -threshold) {
      onChoose('left')
    } else if (power >= threshold) {
      onChoose('right')
    } else {
      animate(x, 0, { type: 'spring', stiffness: 380, damping: 32 })
    }
  }

  return (
    <motion.div
      className="card-shell"
      custom={direction}
      variants={cardVariants}
      initial="enter"
      animate="center"
      exit="exit"
    >
      <motion.div
        className="game-card"
        role="group"
        aria-label={`事件卡：${card.title}`}
        drag={disabled ? false : 'x'}
        dragMomentum={false}
        dragElastic={1}
        onDragEnd={handleDragEnd}
        style={{ x, rotate }}
      >
        <span className="card-seal" aria-hidden="true">
          令
        </span>

        <h2 className="card-title">{card.title}</h2>
        <p className="card-desc">{card.desc}</p>

        <div className="card-options">
          <div className="option option-left">
            <span className="option-arrow">◀</span>
            <span className="option-label">{card.left.label}</span>
          </div>
          <div className="option option-right">
            <span className="option-label">{card.right.label}</span>
            <span className="option-arrow">▶</span>
          </div>
        </div>

        <motion.div
          className="swipe-hint swipe-hint-left"
          style={{ opacity: leftHintOpacity }}
          aria-hidden="true"
        >
          左选
        </motion.div>
        <motion.div
          className="swipe-hint swipe-hint-right"
          style={{ opacity: rightHintOpacity }}
          aria-hidden="true"
        >
          右选
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

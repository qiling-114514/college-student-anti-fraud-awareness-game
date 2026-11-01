import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Header from './components/Header.jsx'
import StatsPanel from './components/StatsPanel.jsx'
import GameCard from './components/GameCard.jsx'
import EventLog from './components/EventLog.jsx'
import ActionBar from './components/ActionBar.jsx'
import GameOverModal from './components/GameOverModal.jsx'
import useKeyboardControls from './hooks/useKeyboardControls.js'
import { getCard } from './data/cards.js'
import { CARD_LOCK_MS } from './game/constants.js'
import { useGameStore } from './game/useGameStore.js'

export default function App() {
  const stats = useGameStore((state) => state.stats)
  const turn = useGameStore((state) => state.turn)
  const gameId = useGameStore((state) => state.gameId)
  const currentCardId = useGameStore((state) => state.currentCardId)
  const ended = useGameStore((state) => state.ended)
  const failReason = useGameStore((state) => state.failReason)
  const log = useGameStore((state) => state.log)
  const restart = useGameStore((state) => state.restart)

  const card = getCard(currentCardId)
  const [direction, setDirection] = useState(0)
  const [locked, setLocked] = useState(false)
  // 底部按钮跟随“可见卡牌”：旧卡飞出期间仍显示旧卡选项
  const [actionCard, setActionCard] = useState(card)
  const lockedRef = useRef(false)
  const unlockTimerRef = useRef(null)

  useEffect(() => {
    if (!locked) setActionCard(card)
  }, [card, locked])

  useEffect(() => () => window.clearTimeout(unlockTimerRef.current), [])

  const handleChoose = useCallback((side) => {
    if (lockedRef.current) return

    const state = useGameStore.getState()
    if (state.ended || state.currentCardId == null) return

    lockedRef.current = true
    setLocked(true)
    setDirection(side === 'left' ? -1 : 1)
    state.choose(side)

    // 回合结算失败时没有新卡入场，立即解锁
    if (useGameStore.getState().ended) {
      lockedRef.current = false
      setLocked(false)
      return
    }

    window.clearTimeout(unlockTimerRef.current)
    unlockTimerRef.current = window.setTimeout(() => {
      lockedRef.current = false
      setLocked(false)
    }, CARD_LOCK_MS)
  }, [])

  const handleRestart = useCallback(() => {
    window.clearTimeout(unlockTimerRef.current)
    lockedRef.current = false
    setLocked(false)
    setDirection(0)
    restart()
  }, [restart])

  useKeyboardControls({ onChoose: handleChoose, onRestart: handleRestart })

  const cardKey = `${gameId}-${turn}-${currentCardId}`

  return (
    <div className="app">
      <Header turn={turn} onRestart={handleRestart} />
      <StatsPanel stats={stats} />

      <main className="card-area">
        <div className="card-stage">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            {card && (
              <GameCard
                key={cardKey}
                card={card}
                direction={direction}
                disabled={ended || locked}
                onChoose={handleChoose}
              />
            )}
          </AnimatePresence>
          <p className="hint">左右滑动卡牌，或点击下方按钮做选择</p>
        </div>
      </main>

      <EventLog entries={log} />
      <ActionBar card={actionCard} disabled={ended} onChoose={handleChoose} />

      <GameOverModal
        open={ended}
        reason={failReason}
        turn={turn}
        onRestart={handleRestart}
      />
    </div>
  )
}

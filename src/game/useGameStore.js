import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { SAVE_KEY } from './constants.js'
import { createGame, resolveChoice } from './engine.js'

/**
 * 游戏状态仓库。
 * - `choose(side)`：做出选择并推进对局
 * - `restart()`：重开一局（gameId 自增，用于重置卡牌动画 key）
 *
 * 使用 zustand/persist 自动持久化到 localStorage。
 */
export const useGameStore = create(
  persist(
    (set) => ({
      ...createGame(),
      choose: (side) => set((state) => resolveChoice(state, side)),
      restart: () => set((state) => createGame({ gameId: state.gameId + 1 })),
    }),
    {
      name: SAVE_KEY,
      version: 1,
      // 只持久化对局数据，不保存函数
      partialize: (state) => ({
        gameId: state.gameId,
        stats: state.stats,
        turn: state.turn,
        deck: state.deck,
        currentCardId: state.currentCardId,
        lastCardId: state.lastCardId,
        ended: state.ended,
        failStat: state.failStat,
        failReason: state.failReason,
        log: state.log,
      }),
    },
  ),
)

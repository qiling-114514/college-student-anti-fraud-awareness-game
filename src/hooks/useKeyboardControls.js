import { useEffect } from 'react'

/**
 * 键盘操作：←/A 左选，→/D 右选，R 重开。
 * @param {{ onChoose: (side: 'left' | 'right') => void, onRestart: () => void }} handlers
 */
export default function useKeyboardControls({ onChoose, onRestart }) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.repeat || event.altKey || event.ctrlKey || event.metaKey) return

      const key = event.key.toLowerCase()
      if (key === 'arrowleft' || key === 'a') {
        event.preventDefault()
        onChoose('left')
      } else if (key === 'arrowright' || key === 'd') {
        event.preventDefault()
        onChoose('right')
      } else if (key === 'r') {
        onRestart()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onChoose, onRestart])
}

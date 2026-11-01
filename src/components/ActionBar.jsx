/**
 * 底部左右选择按钮。
 * @param {{
 *   card: import('../data/cards.js').GameCardData | null,
 *   disabled: boolean,
 *   onChoose: (side: 'left' | 'right') => void,
 * }} props
 */
export default function ActionBar({ card, disabled, onChoose }) {
  return (
    <footer className="actions">
      <button
        className="action-btn action-left"
        type="button"
        disabled={disabled || !card}
        onClick={() => onChoose('left')}
      >
        ◀ {card ? card.left.label : '左选'}
      </button>
      <button
        className="action-btn action-right"
        type="button"
        disabled={disabled || !card}
        onClick={() => onChoose('right')}
      >
        {card ? card.right.label : '右选'} ▶
      </button>
    </footer>
  )
}

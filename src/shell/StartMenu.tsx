import type { AppId } from '../content/site'
import { useOpenApp, useWindowManager } from '../state/windowManager'

const ITEMS: { appId: AppId; label: string; icon: string }[] = [
  { appId: 'about', label: 'About Me', icon: '👤' },
  { appId: 'resume', label: 'Resume.pdf', icon: '📄' },
  { appId: 'thesis', label: 'Thesis.pdf', icon: '📘' },
  { appId: 'connect', label: 'Network Neighborhood', icon: '🌐' },
  { appId: 'minesweeper', label: 'Minesweeper', icon: '💣' },
  { appId: 'solitaire', label: 'Solitaire', icon: '🃏' },
  { appId: 'notepad', label: 'Notepad (readme.txt)', icon: '📝' },
  { appId: 'recycle', label: 'Recycle Bin', icon: '🗑️' },
]

export function StartMenu() {
  const open = useOpenApp()
  const { setStartOpen } = useWindowManager()

  return (
    <div
      className="start-menu raised"
      role="menu"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="start-banner">Dillon95</div>
      <div className="start-items">
        {ITEMS.map((item, i) => (
          <div key={item.appId}>
            {(i === 4 || i === 6) && <div className="start-divider" />}
            <button
              type="button"
              className="start-item"
              role="menuitem"
              onClick={() => {
                open(item.appId)
                setStartOpen(false)
              }}
            >
              <span className="item-icon" aria-hidden>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useWindowManager } from '../state/windowManager'
import { StartMenu } from './StartMenu'

function formatTime(d: Date) {
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

export function Taskbar() {
  const {
    windows,
    focusedId,
    startOpen,
    toggleStart,
    restoreWindow,
    minimizeWindow,
    setStartOpen,
  } = useWindowManager()
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 15_000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (!startOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setStartOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [startOpen, setStartOpen])

  return (
    <>
      {startOpen && <StartMenu />}
      <div className="taskbar raised">
        <button
          type="button"
          className={`start-btn raised ${startOpen ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation()
            toggleStart()
          }}
        >
          <span className="start-logo" aria-hidden>
            🪟
          </span>
          Start
        </button>

        <div className="taskbar-windows">
          {windows.map((w) => {
            const active = focusedId === w.id && !w.minimized
            return (
              <button
                key={w.id}
                type="button"
                className={`task-btn raised-thin ${active ? 'active' : ''}`}
                onClick={() => {
                  if (w.minimized || focusedId !== w.id) restoreWindow(w.id)
                  else minimizeWindow(w.id)
                }}
              >
                {w.title}
              </button>
            )
          })}
        </div>

        <div className="tray sunken-thin" aria-label="System tray">
          <span title="System is fine. Probably.">🔊</span>
          <time dateTime={now.toISOString()}>{formatTime(now)}</time>
        </div>
      </div>
    </>
  )
}

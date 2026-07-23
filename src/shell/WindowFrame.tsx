import {
  useCallback,
  useRef,
  type ReactNode,
  type MouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { useWindowManager, type WindowInstance } from '../state/windowManager'

type Props = {
  win: WindowInstance
  children: ReactNode
  bodyClassName?: string
}

/** Narrow / phone layout uses full-bleed windows (CSS); skip title-bar drag there. */
function isMobileLayout() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(max-width: 640px)').matches
  )
}

export function WindowFrame({ win, children, bodyClassName = '' }: Props) {
  const { focusedId, focusWindow, closeWindow, minimizeWindow, moveWindow } =
    useWindowManager()
  const drag = useRef<{ ox: number; oy: number; sx: number; sy: number } | null>(
    null,
  )
  const active = focusedId === win.id

  const onTitleDown = useCallback(
    (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('.window-btn')) return
      focusWindow(win.id)
      if (isMobileLayout()) return
      e.preventDefault()
      drag.current = {
        ox: e.clientX,
        oy: e.clientY,
        sx: win.x,
        sy: win.y,
      }

      const onMove = (ev: globalThis.MouseEvent) => {
        if (!drag.current) return
        const dx = ev.clientX - drag.current.ox
        const dy = ev.clientY - drag.current.oy
        moveWindow(win.id, drag.current.sx + dx, drag.current.sy + dy)
      }
      const onUp = () => {
        drag.current = null
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('mouseup', onUp)
      }
      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseup', onUp)
    },
    [focusWindow, moveWindow, win.id, win.x, win.y],
  )

  /** Keep title-bar chrome taps from starting a drag / focus race on touch. */
  const stopChromePointer = useCallback(
    (e: ReactPointerEvent | MouseEvent) => {
      e.stopPropagation()
    },
    [],
  )

  if (win.minimized) return null

  return (
    <div
      className={`window raised ${active ? 'active' : ''}`}
      style={{
        left: win.x,
        top: win.y,
        width: win.width,
        height: win.height,
        zIndex: win.zIndex,
      }}
      onMouseDown={() => focusWindow(win.id)}
      role="dialog"
      aria-label={win.title}
    >
      <div className="window-titlebar" onMouseDown={onTitleDown}>
        <div className="window-title">{win.title}</div>
        <div className="window-controls">
          <button
            type="button"
            className="window-btn raised-thin"
            aria-label="Minimize"
            onPointerDown={stopChromePointer}
            onMouseDown={stopChromePointer}
            onClick={(e) => {
              e.stopPropagation()
              minimizeWindow(win.id)
            }}
          >
            _
          </button>
          <button
            type="button"
            className="window-btn raised-thin"
            aria-label="Maximize (not available)"
            title="Maximize is disabled in this demo"
            disabled
            style={{ opacity: 0.5 }}
            onPointerDown={stopChromePointer}
            onMouseDown={stopChromePointer}
          >
            □
          </button>
          <button
            type="button"
            className="window-btn raised-thin"
            aria-label="Close"
            onPointerDown={stopChromePointer}
            onMouseDown={stopChromePointer}
            onClick={(e) => {
              e.stopPropagation()
              closeWindow(win.id)
            }}
          >
            ×
          </button>
        </div>
      </div>
      <div className={`window-body ${bodyClassName}`.trim()}>{children}</div>
    </div>
  )
}

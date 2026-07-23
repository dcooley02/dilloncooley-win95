import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AppId } from '../content/site'

export type WindowInstance = {
  id: string
  appId: AppId
  title: string
  x: number
  y: number
  width: number
  height: number
  zIndex: number
  minimized: boolean
}

type OpenAppOptions = {
  title: string
  width?: number
  height?: number
  x?: number
  y?: number
  singleton?: boolean
}

type WindowManagerValue = {
  windows: WindowInstance[]
  focusedId: string | null
  startOpen: boolean
  openApp: (appId: AppId, options: OpenAppOptions) => void
  closeWindow: (id: string) => void
  focusWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  restoreWindow: (id: string) => void
  moveWindow: (id: string, x: number, y: number) => void
  toggleStart: () => void
  setStartOpen: (open: boolean) => void
}

const WindowManagerContext = createContext<WindowManagerValue | null>(null)

let zCounter = 10
let idCounter = 0

const DEFAULTS: Record<
  AppId,
  { title: string; width: number; height: number; singleton: boolean }
> = {
  about: { title: 'About Me', width: 520, height: 420, singleton: true },
  resume: { title: 'Resume.pdf', width: 720, height: 560, singleton: true },
  thesis: { title: 'Thesis.pdf', width: 720, height: 560, singleton: true },
  connect: {
    title: 'Network Neighborhood',
    width: 440,
    height: 320,
    singleton: true,
  },
  minesweeper: {
    title: 'Minesweeper',
    width: 280,
    height: 360,
    singleton: true,
  },
  notepad: { title: 'readme.txt - Notepad', width: 480, height: 400, singleton: true },
  solitaire: { title: 'Solitaire', width: 640, height: 480, singleton: true },
  recycle: { title: 'Recycle Bin', width: 400, height: 280, singleton: true },
}

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<WindowInstance[]>([])
  const [focusedId, setFocusedId] = useState<string | null>(null)
  const [startOpen, setStartOpen] = useState(false)

  const openApp = useCallback((appId: AppId, options: OpenAppOptions) => {
    const defaults = DEFAULTS[appId]
    const singleton = options.singleton ?? defaults.singleton

    setWindows((prev) => {
      if (singleton) {
        const existing = prev.find((w) => w.appId === appId)
        if (existing) {
          zCounter += 1
          setFocusedId(existing.id)
          return prev.map((w) =>
            w.id === existing.id
              ? { ...w, minimized: false, zIndex: zCounter }
              : w,
          )
        }
      }

      idCounter += 1
      zCounter += 1
      const offset = (prev.length % 8) * 24
      const mobile =
        typeof window !== 'undefined' &&
        window.matchMedia('(max-width: 640px)').matches
      const margin = 4
      const taskbar = 44
      const x = mobile
        ? margin
        : (options.x ?? 80 + offset)
      const y = mobile
        ? margin
        : (options.y ?? 48 + offset)
      const width = mobile
        ? Math.max(200, window.innerWidth - margin * 2)
        : (options.width ?? defaults.width)
      const height = mobile
        ? Math.max(160, window.innerHeight - taskbar - margin * 2)
        : (options.height ?? defaults.height)

      const instance: WindowInstance = {
        id: `${appId}-${idCounter}`,
        appId,
        title: options.title || defaults.title,
        x,
        y,
        width,
        height,
        zIndex: zCounter,
        minimized: false,
      }
      setFocusedId(instance.id)
      return [...prev, instance]
    })
    setStartOpen(false)
  }, [])

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id))
    setFocusedId((current) => (current === id ? null : current))
  }, [])

  const focusWindow = useCallback((id: string) => {
    zCounter += 1
    setFocusedId(id)
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: zCounter, minimized: false } : w)),
    )
    setStartOpen(false)
  }, [])

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, minimized: true } : w)),
    )
    setFocusedId((current) => (current === id ? null : current))
  }, [])

  const restoreWindow = useCallback(
    (id: string) => {
      focusWindow(id)
    },
    [focusWindow],
  )

  const moveWindow = useCallback((id: string, x: number, y: number) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, x: Math.max(0, x), y: Math.max(0, y) } : w)),
    )
  }, [])

  const toggleStart = useCallback(() => {
    setStartOpen((v) => !v)
  }, [])

  const value = useMemo(
    () => ({
      windows,
      focusedId,
      startOpen,
      openApp,
      closeWindow,
      focusWindow,
      minimizeWindow,
      restoreWindow,
      moveWindow,
      toggleStart,
      setStartOpen,
    }),
    [
      windows,
      focusedId,
      startOpen,
      openApp,
      closeWindow,
      focusWindow,
      minimizeWindow,
      restoreWindow,
      moveWindow,
      toggleStart,
    ],
  )

  return (
    <WindowManagerContext.Provider value={value}>
      {children}
    </WindowManagerContext.Provider>
  )
}

export function useWindowManager() {
  const ctx = useContext(WindowManagerContext)
  if (!ctx) throw new Error('useWindowManager must be used within provider')
  return ctx
}

export function useOpenApp() {
  const { openApp } = useWindowManager()
  return useCallback(
    (appId: AppId) => {
      const d = DEFAULTS[appId]
      openApp(appId, { title: d.title, width: d.width, height: d.height })
    },
    [openApp],
  )
}

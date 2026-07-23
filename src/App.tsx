import { useEffect, useState } from 'react'
import { Desktop } from './shell/Desktop'
import { WindowManagerProvider, useOpenApp } from './state/windowManager'

function BootSplash({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1600)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className="boot-screen" role="status" aria-live="polite">
      <div className="boot-logo">Dillon95</div>
      <div>Starting Windows…</div>
      <div className="boot-bar">
        <div className="boot-fill" />
      </div>
      <div style={{ opacity: 0.7, fontSize: 12 }}>dilloncooley.us</div>
    </div>
  )
}

function WelcomeOpener() {
  const open = useOpenApp()
  useEffect(() => {
    const t = setTimeout(() => open('about'), 100)
    return () => clearTimeout(t)
  }, [open])
  return null
}

export default function App() {
  const [booted, setBooted] = useState(false)

  if (!booted) {
    return <BootSplash onDone={() => setBooted(true)} />
  }

  return (
    <WindowManagerProvider>
      <WelcomeOpener />
      <Desktop />
    </WindowManagerProvider>
  )
}

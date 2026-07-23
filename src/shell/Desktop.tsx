import { useState } from 'react'
import { site } from '../content/site'
import type { AppId } from '../content/site'
import { AboutApp } from '../apps/AboutApp'
import { ConnectApp } from '../apps/ConnectApp'
import { MinesweeperApp } from '../apps/MinesweeperApp'
import { NotepadApp } from '../apps/NotepadApp'
import { PdfApp } from '../apps/PdfApp'
import { RecycleApp } from '../apps/RecycleApp'
import { SolitaireApp } from '../apps/SolitaireApp'
import { useWindowManager } from '../state/windowManager'
import { DesktopIcon } from './DesktopIcon'
import { Taskbar } from './Taskbar'
import { WindowFrame } from './WindowFrame'

const ICONS = [
  { appId: 'about' as const, label: 'About Me', icon: '👤' },
  { appId: 'resume' as const, label: 'Resume', icon: '📄' },
  { appId: 'thesis' as const, label: 'Thesis', icon: '📘' },
  { appId: 'connect' as const, label: 'Network', icon: '🌐' },
  { appId: 'minesweeper' as const, label: 'Minesweeper', icon: '💣' },
  { appId: 'solitaire' as const, label: 'Solitaire', icon: '🃏' },
  { appId: 'notepad' as const, label: 'readme.txt', icon: '📝' },
  { appId: 'recycle' as const, label: 'Recycle Bin', icon: '🗑️' },
]

function AppContent({ appId }: { appId: (typeof ICONS)[number]['appId'] }) {
  switch (appId) {
    case 'about':
      return <AboutApp />
    case 'resume':
      return (
        <PdfApp
          title={site.resume.title}
          pdfUrl={site.resume.pdf}
        />
      )
    case 'thesis':
      return (
        <PdfApp
          title={site.thesis.title}
          subtitle={site.thesis.meta}
          pdfUrl={site.thesis.pdf}
        />
      )
    case 'connect':
      return <ConnectApp />
    case 'minesweeper':
      return <MinesweeperApp />
    case 'notepad':
      return <NotepadApp />
    case 'solitaire':
      return <SolitaireApp />
    case 'recycle':
      return <RecycleApp />
    default:
      return null
  }
}

export function Desktop() {
  const { windows, startOpen, setStartOpen } = useWindowManager()
  const [selectedAppId, setSelectedAppId] = useState<AppId | null>(null)

  return (
    <div
      className="desktop"
      onMouseDown={(e) => {
        if (startOpen) setStartOpen(false)
        if (!(e.target as HTMLElement).closest('.desktop-icon')) {
          setSelectedAppId(null)
        }
      }}
    >
      <div className="desktop-icons">
        {ICONS.map((icon) => (
          <DesktopIcon
            key={icon.appId}
            {...icon}
            selected={selectedAppId === icon.appId}
            onSelect={() => setSelectedAppId(icon.appId)}
          />
        ))}
      </div>

      {windows.map((win) => (
        <WindowFrame
          key={win.id}
          win={win}
          bodyClassName={
            win.appId === 'minesweeper' ||
            win.appId === 'solitaire' ||
            win.appId === 'resume' ||
            win.appId === 'thesis' ||
            win.appId === 'notepad'
              ? ''
              : 'padded'
          }
        >
          <AppContent appId={win.appId} />
        </WindowFrame>
      ))}

      <Taskbar />
    </div>
  )
}

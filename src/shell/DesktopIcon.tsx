import type { AppId } from '../content/site'
import { useOpenApp } from '../state/windowManager'

type Props = {
  appId: AppId
  label: string
  icon: string
  selected: boolean
  onSelect: () => void
}

export function DesktopIcon({ appId, label, icon, selected, onSelect }: Props) {
  const open = useOpenApp()

  const launch = () => {
    onSelect()
    open(appId)
  }

  return (
    <button
      type="button"
      className={`desktop-icon${selected ? ' selected' : ''}`}
      onMouseDown={(e) => {
        e.stopPropagation()
      }}
      onClick={(e) => {
        e.stopPropagation()
        launch()
      }}
      onDoubleClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
        launch()
      }}
      onFocus={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          launch()
        }
      }}
      title={`Open ${label}`}
    >
      <span className="icon-glyph" aria-hidden>
        {icon}
      </span>
      <span className="icon-label">{label}</span>
    </button>
  )
}

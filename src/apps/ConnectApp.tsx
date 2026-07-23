import { site } from '../content/site'

const ICONS: Record<string, string> = {
  linkedin: '💼',
  x: '✖️',
  substack: '📰',
  github: '🐙',
}

export function ConnectApp() {
  return (
    <div className="app-body">
      <h2 className="app-heading">Network Neighborhood</h2>
      <p className="app-sub">Entire network · 4 computer(s) found</p>
      <ul className="link-list">
        {site.links.map((link) => (
          <li key={link.id}>
            <a
              className="raised-thin"
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="link-icon" aria-hidden>
                {ICONS[link.id] ?? '🔗'}
              </span>
              <span className="link-meta">
                <strong>{link.label}</strong>
                <span className="link-desc">{link.description}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

import { site } from '../content/site'

export function AboutApp() {
  return (
    <div className="app-body">
      <h2 className="app-heading">{site.name}</h2>
      <p className="app-sub">{site.title}</p>
      {site.bio.map((paragraph) => (
        <p key={paragraph.slice(0, 32)}>{paragraph}</p>
      ))}
    </div>
  )
}

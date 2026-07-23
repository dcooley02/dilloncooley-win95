type Props = {
  title: string
  subtitle?: string
  pdfUrl: string
}

export function PdfApp({ title, subtitle, pdfUrl }: Props) {
  return (
    <div className="pdf-shell">
      <div className="pdf-toolbar">
        <strong>{title}</strong>
        {subtitle && <span style={{ color: '#404040' }}>{subtitle}</span>}
        <span style={{ flex: 1 }} />
        <a className="win-btn raised-thin" href={pdfUrl} target="_blank" rel="noopener noreferrer">
          Open
        </a>
        <a className="win-btn raised-thin" href={pdfUrl} download>
          Download
        </a>
      </div>
      <iframe className="pdf-frame" title={title} src={pdfUrl} />
    </div>
  )
}

import { site } from '../content/site'

export function NotepadApp() {
  return <pre className="notepad-body">{site.notepad}</pre>
}

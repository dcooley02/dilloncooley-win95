const TRASH = [{ name: 'old_portfolio_v1.html' }]

export function RecycleApp() {
  return (
    <div className="app-body">
      <h2 className="app-heading">Recycle Bin</h2>
      <p className="app-sub">1 object</p>
      <ul className="recycle-list sunken">
        {TRASH.map((item) => (
          <li key={item.name}>
            <strong>{item.name}</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}

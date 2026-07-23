import { useCallback, useMemo, useState } from 'react'

const ROWS = 9
const COLS = 9
const MINES = 10

type Cell = {
  mine: boolean
  revealed: boolean
  flagged: boolean
  adjacent: number
}

type Status = 'ready' | 'playing' | 'won' | 'lost'

function emptyGrid(): Cell[][] {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({
      mine: false,
      revealed: false,
      flagged: false,
      adjacent: 0,
    })),
  )
}

function neighbors(r: number, c: number) {
  const out: [number, number][] = []
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue
      const nr = r + dr
      const nc = c + dc
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) out.push([nr, nc])
    }
  }
  return out
}

function placeMines(grid: Cell[][], safeR: number, safeC: number) {
  const next = grid.map((row) => row.map((cell) => ({ ...cell })))
  let placed = 0
  while (placed < MINES) {
    const r = Math.floor(Math.random() * ROWS)
    const c = Math.floor(Math.random() * COLS)
    if (next[r][c].mine) continue
    if (Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1) continue
    next[r][c].mine = true
    placed++
  }
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (next[r][c].mine) continue
      next[r][c].adjacent = neighbors(r, c).filter(([nr, nc]) => next[nr][nc].mine)
        .length
    }
  }
  return next
}

function revealFlood(grid: Cell[][], r: number, c: number) {
  const next = grid.map((row) => row.map((cell) => ({ ...cell })))
  const stack: [number, number][] = [[r, c]]
  while (stack.length) {
    const [cr, cc] = stack.pop()!
    const cell = next[cr][cc]
    if (cell.revealed || cell.flagged) continue
    cell.revealed = true
    if (!cell.mine && cell.adjacent === 0) {
      for (const [nr, nc] of neighbors(cr, cc)) {
        if (!next[nr][nc].revealed && !next[nr][nc].flagged) stack.push([nr, nc])
      }
    }
  }
  return next
}

function checkWin(grid: Cell[][]) {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = grid[r][c]
      if (!cell.mine && !cell.revealed) return false
    }
  }
  return true
}

export function MinesweeperApp() {
  const [grid, setGrid] = useState<Cell[][]>(() => emptyGrid())
  const [status, setStatus] = useState<Status>('ready')
  const [minesPlaced, setMinesPlaced] = useState(false)

  const flags = useMemo(
    () => grid.flat().filter((c) => c.flagged).length,
    [grid],
  )
  const remaining = MINES - flags

  const reset = useCallback(() => {
    setGrid(emptyGrid())
    setStatus('ready')
    setMinesPlaced(false)
  }, [])

  const openCell = useCallback(
    (r: number, c: number) => {
      if (status === 'won' || status === 'lost') return
      let working = grid
      let placed = minesPlaced
      if (!placed) {
        working = placeMines(grid, r, c)
        placed = true
        setMinesPlaced(true)
        setStatus('playing')
      }
      const cell = working[r][c]
      if (cell.revealed || cell.flagged) return

      if (cell.mine) {
        const lost = working.map((row) =>
          row.map((c0) => (c0.mine ? { ...c0, revealed: true } : { ...c0 })),
        )
        lost[r][c] = { ...lost[r][c], revealed: true }
        setGrid(lost)
        setStatus('lost')
        return
      }

      const revealed = revealFlood(working, r, c)
      if (checkWin(revealed)) {
        setGrid(
          revealed.map((row) =>
            row.map((c0) => (c0.mine ? { ...c0, flagged: true } : c0)),
          ),
        )
        setStatus('won')
      } else {
        setGrid(revealed)
      }
    },
    [grid, minesPlaced, status],
  )

  const flagCell = useCallback(
    (r: number, c: number) => {
      if (status === 'won' || status === 'lost') return
      setGrid((prev) => {
        const next = prev.map((row) => row.map((cell) => ({ ...cell })))
        const cell = next[r][c]
        if (cell.revealed) return prev
        cell.flagged = !cell.flagged
        return next
      })
      if (status === 'ready') setStatus('playing')
    },
    [status],
  )

  const face =
    status === 'won' ? '😎' : status === 'lost' ? '😵' : status === 'playing' ? '🙂' : '😊'

  return (
    <div className="mines-app">
      <div className="mines-hud sunken">
        <div className="mines-counter">{String(Math.max(0, remaining)).padStart(3, '0')}</div>
        <button type="button" className="mines-face raised" onClick={reset} title="New game">
          {face}
        </button>
        <div className="mines-counter" title="Classic 9×9 · 10 mines">
          9×9
        </div>
      </div>
      <div
        className="mines-grid"
        style={{ gridTemplateColumns: `repeat(${COLS}, 20px)` }}
        onContextMenu={(e) => e.preventDefault()}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => {
            let content: string = ''
            let className = 'mines-cell '
            if (cell.revealed) {
              className += 'revealed '
              if (cell.mine) {
                content = '💣'
                className += 'mine'
              } else if (cell.adjacent > 0) {
                content = String(cell.adjacent)
                className += `n${cell.adjacent}`
              }
            } else {
              className += 'hidden'
              if (cell.flagged) content = '🚩'
            }
            return (
              <button
                key={`${r}-${c}`}
                type="button"
                className={className}
                onClick={() => openCell(r, c)}
                onContextMenu={(e) => {
                  e.preventDefault()
                  flagCell(r, c)
                }}
                aria-label={
                  cell.revealed
                    ? cell.mine
                      ? 'Mine'
                      : `Cell ${cell.adjacent}`
                    : cell.flagged
                      ? 'Flagged'
                      : 'Hidden cell'
                }
              >
                {content}
              </button>
            )
          }),
        )}
      </div>
      <div style={{ fontSize: 10, color: '#404040' }}>
        Left-click open · Right-click flag
        {status === 'won' && ' · You win!'}
        {status === 'lost' && ' · Boom. Try again.'}
      </div>
    </div>
  )
}

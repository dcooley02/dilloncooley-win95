import { useCallback, useMemo, useState } from 'react'

type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades'
type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13

type Card = {
  id: string
  suit: Suit
  rank: Rank
  faceUp: boolean
}

type PileRef =
  | { kind: 'waste' }
  | { kind: 'foundation'; index: number }
  | { kind: 'tableau'; index: number; cardIndex: number }

const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades']
const SUIT_SYMBOL: Record<Suit, string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
}
const RANK_LABEL: Record<Rank, string> = {
  1: 'A',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  8: '8',
  9: '9',
  10: '10',
  11: 'J',
  12: 'Q',
  13: 'K',
}

function isRed(suit: Suit) {
  return suit === 'hearts' || suit === 'diamonds'
}

function createDeck(): Card[] {
  const deck: Card[] = []
  for (const suit of SUITS) {
    for (let rank = 1; rank <= 13; rank++) {
      deck.push({
        id: `${suit}-${rank}`,
        suit,
        rank: rank as Rank,
        faceUp: false,
      })
    }
  }
  return deck
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

type GameState = {
  stock: Card[]
  waste: Card[]
  foundations: Card[][]
  tableau: Card[][]
}

function dealGame(): GameState {
  const deck = shuffle(createDeck())
  const tableau: Card[][] = Array.from({ length: 7 }, () => [])
  let i = 0
  for (let col = 0; col < 7; col++) {
    for (let row = 0; row <= col; row++) {
      const card = deck[i++]
      tableau[col].push({
        ...card,
        faceUp: row === col,
      })
    }
  }
  const stock = deck.slice(i).map((c) => ({ ...c, faceUp: false }))
  return {
    stock,
    waste: [],
    foundations: [[], [], [], []],
    tableau,
  }
}

function cloneGame(g: GameState): GameState {
  return {
    stock: g.stock.map((c) => ({ ...c })),
    waste: g.waste.map((c) => ({ ...c })),
    foundations: g.foundations.map((p) => p.map((c) => ({ ...c }))),
    tableau: g.tableau.map((p) => p.map((c) => ({ ...c }))),
  }
}

function canDropOnFoundation(card: Card, foundation: Card[]): boolean {
  if (foundation.length === 0) return card.rank === 1
  const top = foundation[foundation.length - 1]
  return top.suit === card.suit && card.rank === top.rank + 1
}

function canDropOnTableau(card: Card, pile: Card[]): boolean {
  if (pile.length === 0) return card.rank === 13
  const top = pile[pile.length - 1]
  if (!top.faceUp) return false
  return isRed(card.suit) !== isRed(top.suit) && card.rank === top.rank - 1
}

function isWon(foundations: Card[][]) {
  return foundations.every((p) => p.length === 13)
}

function getSelectedCards(game: GameState, sel: PileRef): Card[] {
  if (sel.kind === 'waste') {
    return game.waste.length ? [game.waste[game.waste.length - 1]] : []
  }
  if (sel.kind === 'foundation') {
    const pile = game.foundations[sel.index]
    return pile.length ? [pile[pile.length - 1]] : []
  }
  return game.tableau[sel.index].slice(sel.cardIndex)
}

function removeSelected(game: GameState, sel: PileRef): GameState {
  const next = cloneGame(game)
  if (sel.kind === 'waste') {
    next.waste.pop()
  } else if (sel.kind === 'foundation') {
    next.foundations[sel.index].pop()
  } else {
    next.tableau[sel.index] = next.tableau[sel.index].slice(0, sel.cardIndex)
    const pile = next.tableau[sel.index]
    if (pile.length && !pile[pile.length - 1].faceUp) {
      pile[pile.length - 1] = { ...pile[pile.length - 1], faceUp: true }
    }
  }
  return next
}

function sameRef(a: PileRef | null, b: PileRef): boolean {
  if (!a) return false
  if (a.kind !== b.kind) return false
  if (a.kind === 'waste' && b.kind === 'waste') return true
  if (a.kind === 'foundation' && b.kind === 'foundation') return a.index === b.index
  if (a.kind === 'tableau' && b.kind === 'tableau') {
    return a.index === b.index && a.cardIndex === b.cardIndex
  }
  return false
}

function CardFace({
  card,
  selected,
  stacked,
  onClick,
}: {
  card: Card
  selected?: boolean
  stacked?: boolean
  onClick?: () => void
}) {
  const red = isRed(card.suit)
  if (!card.faceUp) {
    return (
      <button
        type="button"
        className={`sol-card sol-card-back${stacked ? ' stacked' : ''}`}
        onClick={onClick}
        aria-label="Face-down card"
      />
    )
  }
  return (
    <button
      type="button"
      className={`sol-card sol-card-face${red ? ' red' : ' black'}${
        selected ? ' selected' : ''
      }${stacked ? ' stacked' : ''}`}
      onClick={onClick}
      aria-label={`${RANK_LABEL[card.rank]} of ${card.suit}`}
    >
      <span className="sol-rank">{RANK_LABEL[card.rank]}</span>
      <span className="sol-suit">{SUIT_SYMBOL[card.suit]}</span>
    </button>
  )
}

function EmptySlot({
  label,
  onClick,
  highlight,
}: {
  label: string
  onClick?: () => void
  highlight?: boolean
}) {
  return (
    <button
      type="button"
      className={`sol-slot${highlight ? ' highlight' : ''}`}
      onClick={onClick}
      aria-label={label}
    />
  )
}

export function SolitaireApp() {
  const [game, setGame] = useState<GameState>(() => dealGame())
  const [selected, setSelected] = useState<PileRef | null>(null)
  const [status, setStatus] = useState<'playing' | 'won'>('playing')
  const [drawCount, setDrawCount] = useState(0)

  const newGame = useCallback(() => {
    setGame(dealGame())
    setSelected(null)
    setStatus('playing')
    setDrawCount(0)
  }, [])

  const tryMove = useCallback(
    (from: PileRef, to: PileRef) => {
      if (status === 'won') return false
      const moving = getSelectedCards(game, from)
      if (!moving.length || !moving[0].faceUp) return false

      // Only single card to foundation / from waste-foundation
      if (to.kind === 'foundation') {
        if (moving.length !== 1) return false
        if (!canDropOnFoundation(moving[0], game.foundations[to.index])) return false
        let next = removeSelected(game, from)
        next.foundations[to.index] = [
          ...next.foundations[to.index],
          { ...moving[0], faceUp: true },
        ]
        setGame(next)
        setSelected(null)
        if (isWon(next.foundations)) setStatus('won')
        return true
      }

      if (to.kind === 'tableau') {
        const dest = game.tableau[to.index]
        if (!canDropOnTableau(moving[0], dest)) return false
        // Don't "move" onto itself
        if (
          from.kind === 'tableau' &&
          from.index === to.index
        ) {
          return false
        }
        let next = removeSelected(game, from)
        next.tableau[to.index] = [
          ...next.tableau[to.index],
          ...moving.map((c) => ({ ...c, faceUp: true })),
        ]
        setGame(next)
        setSelected(null)
        return true
      }

      return false
    },
    [game, status],
  )

  const autoFoundation = useCallback(
    (from: PileRef) => {
      const cards = getSelectedCards(game, from)
      if (cards.length !== 1) return false
      for (let i = 0; i < 4; i++) {
        if (canDropOnFoundation(cards[0], game.foundations[i])) {
          return tryMove(from, { kind: 'foundation', index: i })
        }
      }
      return false
    },
    [game, tryMove],
  )

  const onStockClick = () => {
    if (status === 'won') return
    setSelected(null)
    setGame((prev) => {
      const next = cloneGame(prev)
      if (next.stock.length === 0) {
        // Recycle waste → stock face down
        next.stock = next.waste
          .slice()
          .reverse()
          .map((c) => ({ ...c, faceUp: false }))
        next.waste = []
        return next
      }
      const card = next.stock.pop()!
      next.waste.push({ ...card, faceUp: true })
      return next
    })
    setDrawCount((n) => n + 1)
  }

  const onWasteClick = () => {
    if (status === 'won' || game.waste.length === 0) return
    const ref: PileRef = { kind: 'waste' }
    if (selected && !sameRef(selected, ref)) {
      // waste only receives from nowhere useful — treat as reselect
    }
    if (sameRef(selected, ref)) {
      // double-select → try auto foundation
      if (autoFoundation(ref)) return
      setSelected(null)
      return
    }
    if (selected) {
      // can't drop onto waste; reselect
      setSelected(ref)
      return
    }
    setSelected(ref)
  }

  const onWasteDouble = () => {
    if (game.waste.length === 0) return
    autoFoundation({ kind: 'waste' })
  }

  const onFoundationClick = (index: number) => {
    if (status === 'won') return
    const ref: PileRef = { kind: 'foundation', index }
    if (selected) {
      if (sameRef(selected, ref)) {
        setSelected(null)
        return
      }
      if (tryMove(selected, ref)) return
      // reselect foundation top if any
      if (game.foundations[index].length) setSelected(ref)
      else setSelected(null)
      return
    }
    if (game.foundations[index].length) setSelected(ref)
  }

  const onTableauCardClick = (col: number, cardIndex: number) => {
    if (status === 'won') return
    const pile = game.tableau[col]
    const card = pile[cardIndex]
    if (!card.faceUp) {
      // only flip top face-down if somehow stuck (shouldn't happen)
      return
    }
    // Validate sequence from cardIndex is a legal run
    for (let i = cardIndex; i < pile.length - 1; i++) {
      const a = pile[i]
      const b = pile[i + 1]
      if (
        !a.faceUp ||
        !b.faceUp ||
        isRed(a.suit) === isRed(b.suit) ||
        a.rank !== b.rank + 1
      ) {
        return
      }
    }

    const ref: PileRef = { kind: 'tableau', index: col, cardIndex }

    if (selected) {
      if (sameRef(selected, ref)) {
        // try auto foundation for single card
        if (cardIndex === pile.length - 1 && autoFoundation(ref)) return
        setSelected(null)
        return
      }
      // Drop onto this pile (onto its top)
      if (tryMove(selected, { kind: 'tableau', index: col, cardIndex: pile.length })) {
        return
      }
      setSelected(ref)
      return
    }
    setSelected(ref)
  }

  const onTableauSlotClick = (col: number) => {
    if (status === 'won') return
    if (!selected) return
    tryMove(selected, { kind: 'tableau', index: col, cardIndex: 0 })
  }

  const onTableauDouble = (col: number, cardIndex: number) => {
    const pile = game.tableau[col]
    if (cardIndex !== pile.length - 1) return
    autoFoundation({ kind: 'tableau', index: col, cardIndex })
  }

  const selectedCards = useMemo(
    () => (selected ? getSelectedCards(game, selected) : []),
    [game, selected],
  )
  const selectedIds = useMemo(
    () => new Set(selectedCards.map((c) => c.id)),
    [selectedCards],
  )

  return (
    <div className="sol-app">
      <div className="sol-menubar">
        <button type="button" className="win-btn raised-thin" onClick={newGame}>
          Deal
        </button>
        <span className="sol-status">
          {status === 'won'
            ? 'You win! 🎉'
            : selected
              ? 'Click a valid pile to move'
              : 'Click a card, then a destination · Double-click auto-to-foundation'}
        </span>
        <span className="sol-draws" title="Stock draws this deal">
          {drawCount}
        </span>
      </div>

      <div className="sol-board">
        <div className="sol-top-row">
          <div className="sol-stock-area">
            {game.stock.length > 0 ? (
              <button
                type="button"
                className="sol-card sol-card-back"
                onClick={onStockClick}
                aria-label={`Stock, ${game.stock.length} cards`}
                title="Draw"
              />
            ) : (
              <EmptySlot
                label={game.waste.length ? 'Recycle waste' : 'Empty stock'}
                onClick={onStockClick}
                highlight={game.waste.length > 0}
              />
            )}
            <div
              className="sol-waste"
              onDoubleClick={onWasteDouble}
            >
              {game.waste.length === 0 ? (
                <EmptySlot label="Waste pile" />
              ) : (
                <CardFace
                  card={game.waste[game.waste.length - 1]}
                  selected={selected?.kind === 'waste'}
                  onClick={onWasteClick}
                />
              )}
            </div>
          </div>

          <div className="sol-foundations">
            {game.foundations.map((pile, i) => (
              <div key={i} className="sol-foundation">
                {pile.length === 0 ? (
                  <EmptySlot
                    label={`Foundation ${i + 1}`}
                    onClick={() => onFoundationClick(i)}
                    highlight={
                      !!selected &&
                      getSelectedCards(game, selected).length === 1 &&
                      canDropOnFoundation(
                        getSelectedCards(game, selected)[0],
                        pile,
                      )
                    }
                  />
                ) : (
                  <CardFace
                    card={pile[pile.length - 1]}
                    selected={
                      selected?.kind === 'foundation' && selected.index === i
                    }
                    onClick={() => onFoundationClick(i)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="sol-tableau">
          {game.tableau.map((pile, col) => (
            <div key={col} className="sol-column">
              {pile.length === 0 ? (
                <EmptySlot
                  label={`Tableau ${col + 1}`}
                  onClick={() => onTableauSlotClick(col)}
                  highlight={
                    !!selected &&
                    getSelectedCards(game, selected).length > 0 &&
                    canDropOnTableau(getSelectedCards(game, selected)[0], pile)
                  }
                />
              ) : (
                pile.map((card, cardIndex) => (
                  <div
                    key={card.id}
                    className="sol-stack-item"
                    style={{ zIndex: cardIndex + 1 }}
                    onDoubleClick={() => onTableauDouble(col, cardIndex)}
                  >
                    <CardFace
                      card={card}
                      stacked={cardIndex < pile.length - 1}
                      selected={selectedIds.has(card.id)}
                      onClick={() => onTableauCardClick(col, cardIndex)}
                    />
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      </div>

      {status === 'won' && (
        <div className="sol-win-banner raised">
          <strong>Congratulations!</strong> All foundations complete.
          <button type="button" className="win-btn raised-thin" onClick={newGame}>
            Play again
          </button>
        </div>
      )}
    </div>
  )
}

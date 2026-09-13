import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Clock, RefreshCw, Eye } from 'lucide-react'
import { playCatchSound, playMissSound, playHitSound } from '../../utils/soundEffects'

const CARD_ICONS = [
  { symbol: '⭐', label: 'Star', color: 'from-amber-400 to-yellow-500' },
  { symbol: '🌙', label: 'Moon', color: 'from-indigo-400 to-purple-600' },
  { symbol: '☀️', label: 'Sun', color: 'from-orange-400 to-amber-500' },
  { symbol: '⚡', label: 'Lightning', color: 'from-cyan-400 to-blue-600' },
  { symbol: '🔮', label: 'Orb', color: 'from-purple-500 to-pink-600' },
  { symbol: '🗡️', label: 'Blade', color: 'from-emerald-400 to-teal-600' },
  { symbol: '🛡️', label: 'Shield', color: 'from-blue-500 to-indigo-600' },
  { symbol: '💎', label: 'Crystal', color: 'from-rose-400 to-red-600' },
  { symbol: '👑', label: 'Crown', color: 'from-yellow-400 to-amber-600' },
  { symbol: '🔥', label: 'Flame', color: 'from-red-500 to-orange-500' },
]

export default function MemoryStars({ difficulty = 'MEDIUM', onComplete }) {
  const pairCount = difficulty === 'EASY' ? 6 : difficulty === 'HARD' ? 10 : 8

  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [moves, setMoves] = useState(0)
  const [time, setTime] = useState(0)
  const [isWon, setIsWon] = useState(false)

  // Initialize randomized cards
  useEffect(() => {
    const selectedIcons = CARD_ICONS.slice(0, pairCount)
    const deck = [...selectedIcons, ...selectedIcons].map((item, index) => ({
      uid: index,
      symbol: item.symbol,
      label: item.label,
      color: item.color,
    }))

    // Shuffle deck
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[deck[i], deck[j]] = [deck[j], deck[i]]
    }

    setCards(deck)
    setFlipped([])
    setMatched([])
    setMoves(0)
    setTime(0)
    setIsWon(false)
  }, [difficulty, pairCount])

  // Timer
  useEffect(() => {
    if (isWon) return
    const interval = setInterval(() => setTime((t) => t + 1), 1000)
    return () => clearInterval(interval)
  }, [isWon])

  // Card click handler
  const handleCardClick = (card) => {
    if (flipped.length === 2 || flipped.some((c) => c.uid === card.uid) || matched.includes(card.label)) {
      return
    }

    playHitSound()
    const newFlipped = [...flipped, card]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1)
      const [first, second] = newFlipped

      if (first.label === second.label) {
        // Matched!
        playCatchSound()
        const newMatched = [...matched, first.label]
        setMatched(newMatched)
        setFlipped([])

        if (newMatched.length === pairCount) {
          setIsWon(true)
          const accuracy = Math.round((pairCount / Math.max(pairCount, moves + 1)) * 100)
          const finalScore = Math.max(100, 1000 - time * 10 - moves * 20)
          setTimeout(() => {
            onComplete({
              score: finalScore,
              accuracy,
              timeTakenSeconds: time,
              moves: moves + 1,
              isWon: true,
            })
          }, 800)
        }
      } else {
        // Not matched - flip back
        setTimeout(() => {
          playMissSound()
          setFlipped([])
        }, 850)
      }
    }
  }

  const gridCols = difficulty === 'EASY' ? 'grid-cols-4' : difficulty === 'HARD' ? 'grid-cols-5' : 'grid-cols-4'

  return (
    <div className="flex flex-col items-center justify-between h-full select-none max-w-xl mx-auto w-full">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between px-4 py-2.5 bg-white/5 rounded-2xl border border-white/10 mb-4 font-mono text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-gold" />
          <span className="text-starlight-muted">Pairs:</span>
          <span className="text-white font-bold">{matched.length} / {pairCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-starlight-muted">Moves:</span>
          <span className="text-cyan-300 font-bold">{moves}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-starlight-muted">Time:</span>
          <span className="text-purple-300 font-bold">{time}s</span>
        </div>
      </div>

      {/* Card Grid */}
      <div className={`grid ${gridCols} gap-2.5 sm:gap-3 w-full p-3 rounded-2xl bg-midnight/90 border border-purple-500/20 shadow-inner`}>
        {cards.map((card) => {
          const isRevealed = flipped.some((c) => c.uid === card.uid) || matched.includes(card.label)
          const isDone = matched.includes(card.label)

          return (
            <motion.button
              key={card.uid}
              onClick={() => handleCardClick(card)}
              whileHover={!isRevealed ? { scale: 1.05 } : {}}
              whileTap={!isRevealed ? { scale: 0.95 } : {}}
              className={`aspect-square rounded-xl flex items-center justify-center text-2xl sm:text-3xl border transition-all duration-300 relative overflow-hidden ${
                isDone
                  ? 'bg-emerald-500/20 border-emerald-400/50 shadow-glow-gold opacity-80'
                  : isRevealed
                  ? `bg-gradient-to-br ${card.color} border-white shadow-lg shadow-purple-500/30 scale-100`
                  : 'bg-navy/80 hover:bg-white/10 border-white/15 hover:border-purple-400/50'
              }`}
            >
              {isRevealed ? (
                <motion.span
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', damping: 12 }}
                >
                  {card.symbol}
                </motion.span>
              ) : (
                <div className="flex flex-col items-center opacity-40">
                  <Eye className="w-4 h-4 text-purple-300 mb-0.5" />
                  <span className="text-[9px] font-mono text-white/40">✦</span>
                </div>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Footer Instructions */}
      <div className="text-center text-[11px] text-starlight-muted/80 mt-3 font-mono">
        Flip cards to reveal matching astral pairs • Complete all pairs to harvest starlight
      </div>
    </div>
  )
}

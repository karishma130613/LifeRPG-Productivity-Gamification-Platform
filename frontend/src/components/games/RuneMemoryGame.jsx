import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { Brain, Sparkles, Heart } from 'lucide-react'
import { playRuneTone, playMissSound, playHitSound } from '../../utils/soundEffects'

const RUNES = [
  { id: 0, symbol: 'ᚠ', name: 'Wealth', color: 'from-amber-400 to-yellow-600 border-amber-300' },
  { id: 1, symbol: 'ᚢ', name: 'Strength', color: 'from-emerald-400 to-green-600 border-emerald-300' },
  { id: 2, symbol: 'ᚦ', name: 'Thunder', color: 'from-cyan-400 to-blue-600 border-cyan-300' },
  { id: 3, symbol: 'ᚨ', name: 'Wisdom', color: 'from-purple-400 to-indigo-600 border-purple-300' },
  { id: 4, symbol: 'ᚱ', name: 'Journey', color: 'from-pink-400 to-rose-600 border-pink-300' },
  { id: 5, symbol: 'ᚲ', name: 'Flame', color: 'from-red-400 to-orange-600 border-red-300' },
  { id: 6, symbol: 'ᚷ', name: 'Gift', color: 'from-teal-400 to-emerald-600 border-teal-300' },
  { id: 7, symbol: 'ᚹ', name: 'Joy', color: 'from-blue-400 to-indigo-600 border-blue-300' },
  { id: 8, symbol: 'ᛋ', name: 'Sun', color: 'from-yellow-300 to-amber-500 border-yellow-200' },
]

export default function RuneMemoryGame({ difficulty = 'MEDIUM', onVictory, onDefeat }) {
  const totalRounds = difficulty === 'EASY' ? 2 : difficulty === 'HARD' ? 4 : 3
  const [currentRound, setCurrentRound] = useState(1)
  const [lives, setLives] = useState(3)
  const [activeRune, setActiveRune] = useState(null)
  const [isShowingSequence, setIsShowingSequence] = useState(true)
  const [statusText, setStatusText] = useState('Watch the astral sequence...')

  const sequenceRef = useRef([])
  const playerIndexRef = useRef(0)
  const isGeneratingRef = useRef(false)

  // Start new round sequence
  const startRound = useCallback((roundNum) => {
    isGeneratingRef.current = true
    setIsShowingSequence(true)
    setStatusText('Watch the astral runes light up...')
    playerIndexRef.current = 0

    // Generate sequence of length: round 1 -> 3 runes, round 2 -> 4 runes, etc.
    const seqLength = roundNum + 2
    const newSeq = []
    for (let i = 0; i < seqLength; i++) {
      newSeq.push(Math.floor(Math.random() * 9))
    }
    sequenceRef.current = newSeq

    // Play sequence animation
    let step = 0
    const playNext = () => {
      if (step >= newSeq.length) {
        setActiveRune(null)
        setIsShowingSequence(false)
        setStatusText('Your turn! Replicate the sequence.')
        isGeneratingRef.current = false
        return
      }

      const runeIdx = newSeq[step]
      setActiveRune(runeIdx)
      playRuneTone(runeIdx)

      setTimeout(() => {
        setActiveRune(null)
        step++
        setTimeout(playNext, 250)
      }, 550)
    }

    setTimeout(playNext, 600)
  }, [])

  useEffect(() => {
    startRound(1)
  }, [startRound])

  // Handle player rune click
  const handleRuneClick = (runeId) => {
    if (isShowingSequence || isGeneratingRef.current) return

    playRuneTone(runeId)
    setActiveRune(runeId)
    setTimeout(() => setActiveRune(null), 250)

    const expectedRune = sequenceRef.current[playerIndexRef.current]

    if (runeId === expectedRune) {
      playHitSound()
      playerIndexRef.current++

      // If finished full sequence for this round
      if (playerIndexRef.current >= sequenceRef.current.length) {
        if (currentRound >= totalRounds) {
          setStatusText('Rune matrix illuminated! Victory!')
          setTimeout(() => onVictory(), 400)
        } else {
          setStatusText(`Round ${currentRound} Complete! Next sequence...`)
          setCurrentRound((r) => r + 1)
          setTimeout(() => startRound(currentRound + 1), 900)
        }
      }
    } else {
      // Mistake
      playMissSound()
      const remainingLives = lives - 1
      setLives(remainingLives)

      if (remainingLives <= 0) {
        setStatusText('Astral sequence shattered!')
        setTimeout(() => onDefeat(), 500)
      } else {
        setStatusText('Sequence disrupted! Watch again...')
        setTimeout(() => startRound(currentRound), 900)
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-between h-full select-none">
      {/* HUD */}
      <div className="w-full flex items-center justify-between px-4 py-2 bg-white/5 rounded-xl border border-white/10 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 font-bold">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-starlight-muted uppercase font-mono">Sequence Round</div>
            <div className="text-sm font-bold text-white font-mono">
              <span className="text-purple-400 text-base">{currentRound}</span> / {totalRounds}
            </div>
          </div>
        </div>

        {/* Lives */}
        <div className="flex items-center gap-1">
          {[...Array(3)].map((_, i) => (
            <Heart
              key={i}
              className={`w-4 h-4 transition-colors ${
                i < lives ? 'text-red-400 fill-red-400' : 'text-white/20'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Status banner */}
      <div className="w-full py-1.5 px-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-center mb-3">
        <p className="text-xs text-purple-200 font-medium flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span>{statusText}</span>
        </p>
      </div>

      {/* 3x3 Rune Matrix */}
      <div className="w-full max-w-xs grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-midnight/80 border border-white/10 shadow-inner">
        {RUNES.map((rune) => {
          const isLit = activeRune === rune.id
          return (
            <motion.button
              key={rune.id}
              onClick={() => handleRuneClick(rune.id)}
              disabled={isShowingSequence}
              whileHover={!isShowingSequence ? { scale: 1.05 } : {}}
              whileTap={!isShowingSequence ? { scale: 0.95 } : {}}
              className={`h-20 sm:h-22 rounded-xl flex flex-col items-center justify-center border-2 transition-all relative overflow-hidden ${
                isLit
                  ? `bg-gradient-to-br ${rune.colorClass || rune.color} shadow-lg shadow-purple-500/50 scale-105 border-white`
                  : 'bg-white/5 border-white/10 hover:border-white/25 hover:bg-white/10'
              }`}
            >
              <span className={`text-2xl font-serif transition-colors ${isLit ? 'text-white font-bold' : 'text-starlight-muted'}`}>
                {rune.symbol}
              </span>
              <span className="text-[9px] text-white/50 uppercase font-mono mt-1">
                {rune.name}
              </span>
              {isLit && (
                <div className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none" />
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Progress Bar */}
      <div className="w-full mt-3">
        <div className="flex justify-between text-[11px] text-starlight-muted font-mono mb-1">
          <span>PROGRESSION</span>
          <span className="text-purple-300 font-bold">
            {Math.round(((currentRound - 1) / totalRounds) * 100)}%
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
            style={{ width: `${Math.min(100, (currentRound / totalRounds) * 100)}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </div>
  )
}

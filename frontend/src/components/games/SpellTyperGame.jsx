import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Sparkles, Terminal } from 'lucide-react'
import { playTypeSound, playHitSound, playMissSound } from '../../utils/soundEffects'

const SPELL_LIST = [
  'QUANTUM', 'STARLIGHT', 'LEVEL_UP', 'DEEP_WORK',
  'UNSTOPPABLE', 'DISCIPLINE', 'ASTRAL_BOLT', 'FOCUS_FLOW',
  'CHAMPION', 'ILLUMINATE', 'VICTORY', 'CELESTIAL',
]

export default function SpellTyperGame({ difficulty = 'MEDIUM', onVictory, onDefeat }) {
  const targetSpells = difficulty === 'EASY' ? 3 : difficulty === 'HARD' ? 5 : 4
  const maxTime = difficulty === 'EASY' ? 24 : difficulty === 'HARD' ? 18 : 20

  const [spellsCast, setSpellsCast] = useState(0)
  const [currentWord, setCurrentWord] = useState('')
  const [inputVal, setInputVal] = useState('')
  const [timeLeft, setTimeLeft] = useState(maxTime)
  const [hasEnded, setHasEnded] = useState(false)
  const inputRef = useRef(null)

  // Pick random word
  const pickNewWord = () => {
    const word = SPELL_LIST[Math.floor(Math.random() * SPELL_LIST.length)]
    setCurrentWord(word)
    setInputVal('')
  }

  useEffect(() => {
    pickNewWord()
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Timer
  useEffect(() => {
    if (hasEnded) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setHasEnded(true)
          if (spellsCast >= targetSpells) {
            onVictory()
          } else {
            playMissSound()
            onDefeat()
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [hasEnded, spellsCast, targetSpells, onVictory, onDefeat])

  // Check victory
  useEffect(() => {
    if (hasEnded) return
    if (spellsCast >= targetSpells) {
      setHasEnded(true)
      onVictory()
    }
  }, [spellsCast, targetSpells, hasEnded, onVictory])

  // Handle typing
  const handleInputChange = (e) => {
    if (hasEnded) return
    const val = e.target.value.toUpperCase().replace(/\s+/g, '')
    setInputVal(val)
    playTypeSound()

    if (val === currentWord) {
      playHitSound()
      const newCount = spellsCast + 1
      setSpellsCast(newCount)

      if (newCount < targetSpells) {
        pickNewWord()
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-between h-full select-none">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between px-4 py-2 bg-white/5 rounded-xl border border-white/10 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-bold">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-starlight-muted uppercase font-mono">Spells Cast</div>
            <div className="text-sm font-bold text-white font-mono">
              <span className="text-cyan-400 text-base">{spellsCast}</span> / {targetSpells}
            </div>
          </div>
        </div>

        {/* Timer */}
        <div className="text-right">
          <div className="text-[10px] text-starlight-muted uppercase font-mono">Time Left</div>
          <div className={`text-sm font-black font-mono ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-amber-300'}`}>
            {timeLeft}s
          </div>
        </div>
      </div>

      {/* Incantation Casting Circle */}
      <div className="w-full h-56 sm:h-64 flex flex-col items-center justify-center relative rounded-2xl bg-midnight/90 border border-cyan-500/30 overflow-hidden shadow-inner p-6">
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <div className="w-48 h-48 rounded-full border-4 border-dashed border-cyan-400 animate-spin" style={{ animationDuration: '25s' }} />
        </div>

        <div className="text-xs text-starlight-muted mb-2 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Type the spell runes into the casting circle:</span>
        </div>

        {/* Current Word Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentWord}
            initial={{ scale: 0.8, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.1, opacity: 0 }}
            className="flex items-center gap-1 text-2xl sm:text-3xl font-black font-mono tracking-widest my-4"
          >
            {currentWord.split('').map((char, idx) => {
              const typedChar = inputVal[idx]
              const isMatch = typedChar === char
              const isPending = !typedChar

              return (
                <span
                  key={idx}
                  className={`px-1 rounded ${
                    isMatch
                      ? 'text-cyan-300 bg-cyan-500/20 border-b-2 border-cyan-400'
                      : isPending
                      ? 'text-white/70'
                      : 'text-red-400 bg-red-500/20'
                  }`}
                >
                  {char}
                </span>
              )
            })}
          </motion.div>
        </AnimatePresence>

        {/* Input box */}
        <div className="w-full max-w-sm relative mt-2">
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={handleInputChange}
            placeholder="Type spell here..."
            autoFocus
            className="w-full px-4 py-3 rounded-xl bg-white/10 border-2 border-cyan-400/50 text-white font-mono text-center text-lg tracking-widest outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 shadow-lg"
          />
          <Zap className="w-4 h-4 text-cyan-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full mt-3">
        <div className="flex justify-between text-[11px] text-starlight-muted font-mono mb-1">
          <span>INCANTATION POWER</span>
          <span className="text-cyan-300 font-bold">
            {Math.round((spellsCast / targetSpells) * 100)}%
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400 rounded-full"
            style={{ width: `${Math.min(100, (spellsCast / targetSpells) * 100)}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </div>
    </div>
  )
}

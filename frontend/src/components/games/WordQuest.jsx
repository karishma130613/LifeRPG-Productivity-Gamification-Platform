import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Clock, Sparkles, HelpCircle } from 'lucide-react'
import { playHitSound, playCatchSound, playMissSound, playTypeSound } from '../../utils/soundEffects'

const WORD_BANK = [
  {
    word: 'STARLIGHT',
    hint: 'The radiant celestial glow that guides adventurers in the realm.',
    category: 'Cosmic',
  },
  {
    word: 'QUEST',
    hint: 'A purposeful real-life mission to harvest XP and forge discipline.',
    category: 'RPG',
  },
  {
    word: 'DISCIPLINE',
    hint: 'The superpower that turns daily consistency into unstoppable mastery.',
    category: 'Attributes',
  },
  {
    word: 'CHAMPION',
    hint: 'A hero who has triumphed over inner hurdles and giant bosses.',
    category: 'Titles',
  },
  {
    word: 'ELIXIR',
    hint: 'A revitalizing potion restoring strength and clear focus.',
    category: 'Alchemy',
  },
  {
    word: 'ASTRA',
    hint: 'Ancient term for cosmic energy and starry constellations.',
    category: 'Magic',
  },
  {
    word: 'FOCUS',
    hint: 'The mental clarity to resist distractions and create deep work.',
    category: 'Mind',
  },
  {
    word: 'VALOR',
    hint: 'Courage displayed in conquering formidable hurdles.',
    category: 'Spirit',
  },
]

function scramble(word) {
  const letters = word.split('')
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[letters[i], letters[j]] = [letters[j], letters[i]]
  }
  return letters.join('') === word ? scramble(word) : letters.join('')
}

export default function WordQuest({ difficulty = 'MEDIUM', onComplete }) {
  const totalRounds = difficulty === 'EASY' ? 3 : difficulty === 'HARD' ? 6 : 4
  const roundSeconds = difficulty === 'EASY' ? 25 : difficulty === 'HARD' ? 14 : 18

  const [words, setWords] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [scrambled, setScrambled] = useState('')
  const [inputVal, setInputVal] = useState('')
  const [score, setScore] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [wrongCount, setWrongCount] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [timeLeft, setTimeLeft] = useState(roundSeconds)
  const [totalTime, setTotalTime] = useState(0)
  const inputRef = useRef(null)

  useEffect(() => {
    const shuffled = [...WORD_BANK].sort(() => Math.random() - 0.5).slice(0, totalRounds)
    setWords(shuffled)
    setCurrentIdx(0)
    setScore(0)
    setCorrectCount(0)
    setWrongCount(0)
    setShowHint(false)
    setTimeLeft(roundSeconds)
    setTotalTime(0)
    if (shuffled.length > 0) {
      setScrambled(scramble(shuffled[0].word))
    }
  }, [difficulty, totalRounds, roundSeconds])

  useEffect(() => {
    const timer = setInterval(() => setTotalTime((t) => t + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (words.length === 0) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleNext(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [currentIdx, words])

  const handleInputChange = (e) => {
    const val = e.target.value.toUpperCase().trim()
    setInputVal(val)
    playTypeSound()

    const targetWord = words[currentIdx].word
    if (val === targetWord) {
      playCatchSound()
      handleNext(true)
    }
  }

  const handleNext = (isCorrect) => {
    if (isCorrect) {
      setCorrectCount((c) => c + 1)
      const points = 120 + timeLeft * 8 - (showHint ? 30 : 0)
      setScore((s) => s + Math.max(50, points))
    } else {
      playMissSound()
      setWrongCount((w) => w + 1)
    }

    if (currentIdx + 1 >= words.length) {
      // Finished
      const finalCorrect = isCorrect ? correctCount + 1 : correctCount
      const accuracy = Math.round((finalCorrect / totalRounds) * 100)
      onComplete({
        score: Math.max(100, score + (isCorrect ? 120 : 0)),
        accuracy,
        timeTakenSeconds: totalTime,
        answersCorrect: finalCorrect,
        answersWrong: wrongCount + (isCorrect ? 0 : 1),
        isWon: finalCorrect >= Math.ceil(totalRounds / 2),
      })
    } else {
      const nextIdx = currentIdx + 1
      setCurrentIdx(nextIdx)
      setScrambled(scramble(words[nextIdx].word))
      setInputVal('')
      setShowHint(false)
      setTimeLeft(roundSeconds)
      if (inputRef.current) inputRef.current.focus()
    }
  }

  if (words.length === 0) return null
  const currentItem = words[currentIdx]

  return (
    <div className="flex flex-col items-center justify-between h-full select-none max-w-xl mx-auto w-full">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between px-4 py-2.5 bg-white/5 rounded-2xl border border-white/10 mb-3 font-mono text-xs">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <span className="text-starlight-muted">Rune:</span>
          <span className="text-white font-bold">{currentIdx + 1} / {totalRounds}</span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span className="text-starlight-muted">Score:</span>
          <span className="text-gold font-bold">{score}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span className={`font-bold ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-cyan-300'}`}>
            {timeLeft}s
          </span>
        </div>
      </div>

      {/* Timer Bar */}
      <div className="w-full h-1 bg-white/10 rounded-full mb-4 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400"
          animate={{ width: `${(timeLeft / roundSeconds) * 100}%` }}
          transition={{ duration: 0.2 }}
        />
      </div>

      {/* Scrambled Word Parchment */}
      <div className="w-full glass-card p-6 rounded-2xl border border-emerald-500/30 bg-midnight/90 shadow-xl mb-4 text-center">
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 uppercase">
          {currentItem.category} Word Puzzle
        </span>

        {/* Letters tiles */}
        <div className="flex items-center justify-center gap-2 my-4 flex-wrap">
          {scrambled.split('').map((letter, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="w-10 h-12 rounded-xl bg-gradient-to-b from-white/15 to-white/5 border border-white/20 flex items-center justify-center text-xl font-mono font-black text-gold shadow-md"
            >
              {letter}
            </motion.div>
          ))}
        </div>

        {/* Hint toggle */}
        <button
          onClick={() => setShowHint((h) => !h)}
          className="text-xs text-starlight-muted hover:text-white flex items-center justify-center gap-1.5 mx-auto transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5 text-gold" />
          <span>{showHint ? 'Hide Hint' : 'Reveal Lore Clue (-30 pts)'}</span>
        </button>

        {showHint && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-starlight-dim italic mt-2 bg-white/5 p-2.5 rounded-xl border border-white/10"
          >
            &quot;{currentItem.hint}&quot;
          </motion.p>
        )}
      </div>

      {/* Input Box */}
      <div className="w-full relative">
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={handleInputChange}
          placeholder="TYPE UNSCRAMBLED WORD..."
          autoFocus
          className="w-full px-4 py-3.5 rounded-xl bg-white/10 border-2 border-emerald-400/50 text-white font-mono text-center text-lg tracking-widest outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 shadow-lg"
        />
      </div>

      {/* Stats footer */}
      <div className="w-full flex justify-between items-center text-xs font-mono text-starlight-muted mt-3 px-2">
        <span>Word Length: <strong className="text-white">{currentItem.word.length} letters</strong></span>
        <span>Accuracy: <strong className="text-emerald-300">{currentIdx > 0 ? Math.round((correctCount / currentIdx) * 100) : 100}%</strong></span>
      </div>
    </div>
  )
}

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Clock, Sparkles } from 'lucide-react'
import { playHitSound, playCatchSound, playMissSound } from '../../utils/soundEffects'

const QUESTION_BANK = [
  {
    type: 'NUMBER_PATTERN',
    question: 'What is the missing number in the celestial sequence?',
    sequence: '3, 6, 12, 24, ?',
    options: ['36', '48', '42', '52'],
    answer: '48',
    explanation: 'Each number is multiplied by 2.',
  },
  {
    type: 'NUMBER_PATTERN',
    question: 'Complete the starlight progression:',
    sequence: '2, 5, 10, 17, 26, ?',
    options: ['35', '37', '39', '41'],
    answer: '37',
    explanation: 'Pattern adds consecutive odd numbers: +3, +5, +7, +9, +11.',
  },
  {
    type: 'ODD_ONE_OUT',
    question: 'Which artifact does NOT belong in the elemental set?',
    sequence: 'Ruby (Fire), Sapphire (Water), Emerald (Earth), Silver (Metal)',
    options: ['Ruby', 'Sapphire', 'Emerald', 'Silver'],
    answer: 'Silver',
    explanation: 'Silver is a metal element, while the others are precious gemstones.',
  },
  {
    type: 'LOGIC_DEDUCTION',
    question: 'If all Astrals are Mages, and all Mages channel Starlight, then:',
    sequence: 'Premise: Astral ⊂ Mage ⊂ Starlight',
    options: [
      'All Astrals channel Starlight',
      'No Astrals channel Starlight',
      'Only some Mages channel Starlight',
      'Starlight channels Astrals',
    ],
    answer: 'All Astrals channel Starlight',
    explanation: 'By transitive syllogism: Astrals are Mages, so they channel Starlight.',
  },
  {
    type: 'NUMBER_PATTERN',
    question: 'Find the next rune value:',
    sequence: '1, 4, 9, 16, 25, ?',
    options: ['30', '36', '40', '49'],
    answer: '36',
    explanation: 'Consecutive squares: 1², 2², 3², 4², 5², 6² = 36.',
  },
  {
    type: 'SEQUENCE',
    question: 'Determine the missing rune in the cycle:',
    sequence: 'North, East, South, West, North, ?',
    options: ['South', 'East', 'West', 'Nadir'],
    answer: 'East',
    explanation: 'Clockwise rotational compass cycle repeats with East.',
  },
  {
    type: 'LOGIC_DEDUCTION',
    question: 'Warrior A is taller than B. B is taller than C. Who is shortest?',
    sequence: 'A > B > C',
    options: ['Warrior A', 'Warrior B', 'Warrior C', 'Cannot be determined'],
    answer: 'Warrior C',
    explanation: 'Warrior C is at the bottom of the order.',
  },
  {
    type: 'NUMBER_PATTERN',
    question: 'Find the hidden constant:',
    sequence: '100, 95, 85, 70, 50, ?',
    options: ['30', '25', '20', '35'],
    answer: '25',
    explanation: 'Successive subtractions increase: -5, -10, -15, -20, -25 = 25.',
  },
]

export default function MindMaze({ difficulty = 'MEDIUM', onComplete }) {
  const totalRounds = difficulty === 'EASY' ? 3 : difficulty === 'HARD' ? 6 : 4
  const roundSeconds = difficulty === 'EASY' ? 20 : difficulty === 'HARD' ? 12 : 15

  const [questions, setQuestions] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedOpt, setSelectedOpt] = useState(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [wrongCount, setWrongCount] = useState(0)
  const [timeLeft, setTimeLeft] = useState(roundSeconds)
  const [totalTime, setTotalTime] = useState(0)

  // Shuffle and pick questions on start
  useEffect(() => {
    const shuffled = [...QUESTION_BANK].sort(() => Math.random() - 0.5).slice(0, totalRounds)
    setQuestions(shuffled)
    setCurrentIdx(0)
    setSelectedOpt(null)
    setIsAnswered(false)
    setScore(0)
    setCorrectCount(0)
    setWrongCount(0)
    setTimeLeft(roundSeconds)
    setTotalTime(0)
  }, [difficulty, totalRounds, roundSeconds])

  // Total timer
  useEffect(() => {
    const timer = setInterval(() => setTotalTime((t) => t + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  // Question countdown
  useEffect(() => {
    if (isAnswered || questions.length === 0) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleAnswer(null) // Time-out counts as incorrect
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [currentIdx, isAnswered, questions.length])

  const handleAnswer = (option) => {
    if (isAnswered) return
    setIsAnswered(true)
    setSelectedOpt(option)

    const currentQ = questions[currentIdx]
    const isCorrect = option === currentQ.answer

    if (isCorrect) {
      playCatchSound()
      const pts = Math.round(150 + timeLeft * 10)
      setScore((s) => s + pts)
      setCorrectCount((c) => c + 1)
    } else {
      playMissSound()
      setWrongCount((w) => w + 1)
    }

    setTimeout(() => {
      if (currentIdx + 1 >= questions.length) {
        // Game Finished
        const finalCorrect = isCorrect ? correctCount + 1 : correctCount
        const finalAccuracy = Math.round((finalCorrect / totalRounds) * 100)
        onComplete({
          score: Math.max(100, score + (isCorrect ? 150 : 0)),
          accuracy: finalAccuracy,
          timeTakenSeconds: totalTime,
          answersCorrect: finalCorrect,
          answersWrong: wrongCount + (isCorrect ? 0 : 1),
          isWon: finalCorrect >= Math.ceil(totalRounds / 2),
        })
      } else {
        setCurrentIdx((idx) => idx + 1)
        setSelectedOpt(null)
        setIsAnswered(false)
        setTimeLeft(roundSeconds)
      }
    }, 1200)
  }

  if (questions.length === 0) return null
  const currentQ = questions[currentIdx]

  return (
    <div className="flex flex-col items-center justify-between h-full select-none max-w-xl mx-auto w-full">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between px-4 py-2.5 bg-white/5 rounded-2xl border border-white/10 mb-3 font-mono text-xs">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-purple-400" />
          <span className="text-starlight-muted">Round:</span>
          <span className="text-white font-bold">{currentIdx + 1} / {totalRounds}</span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span className="text-starlight-muted">Score:</span>
          <span className="text-gold font-bold">{score}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span className={`font-bold ${timeLeft <= 4 ? 'text-red-400 animate-pulse' : 'text-cyan-300'}`}>
            {timeLeft}s
          </span>
        </div>
      </div>

      {/* Timer progress line */}
      <div className="w-full h-1 bg-white/10 rounded-full mb-4 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 via-cyan-400 to-amber-400"
          animate={{ width: `${(timeLeft / roundSeconds) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Question Card */}
      <div className="w-full glass-card p-5 rounded-2xl border border-purple-500/20 bg-midnight/90 shadow-xl mb-4 text-center">
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-400/30 uppercase">
          {currentQ.type.replace('_', ' ')}
        </span>
        <h3 className="font-title text-base sm:text-lg font-bold text-white mt-2 mb-2">
          {currentQ.question}
        </h3>
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 font-mono text-gold text-sm sm:text-base font-black tracking-wide">
          {currentQ.sequence}
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
        {currentQ.options.map((opt, i) => {
          const isChosen = selectedOpt === opt
          const isCorrect = opt === currentQ.answer

          let btnStyle = 'bg-navy/80 hover:bg-white/10 border-white/10 hover:border-purple-400/50 text-white'
          if (isAnswered) {
            if (isCorrect) {
              btnStyle = 'bg-emerald-500/30 border-emerald-400 text-emerald-200 shadow-glow-gold'
            } else if (isChosen) {
              btnStyle = 'bg-red-500/30 border-red-400 text-red-200'
            } else {
              btnStyle = 'opacity-40 border-white/5 text-white/50'
            }
          }

          return (
            <motion.button
              key={i}
              onClick={() => handleAnswer(opt)}
              disabled={isAnswered}
              whileHover={!isAnswered ? { scale: 1.02 } : {}}
              whileTap={!isAnswered ? { scale: 0.98 } : {}}
              className={`p-3.5 rounded-xl border text-sm font-semibold transition-all text-left flex items-center justify-between ${btnStyle}`}
            >
              <span>{opt}</span>
              <span className="text-xs font-mono opacity-50">[{String.fromCharCode(65 + i)}]</span>
            </motion.button>
          )
        })}
      </div>

      {/* Explanation when answered */}
      <div className="min-h-8 mt-3 flex items-center justify-center text-center">
        {isAnswered && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-starlight-muted font-mono"
          >
            {currentQ.explanation}
          </motion.p>
        )}
      </div>
    </div>
  )
}

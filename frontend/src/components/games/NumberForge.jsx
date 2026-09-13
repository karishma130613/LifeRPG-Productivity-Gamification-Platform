import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Binary, Clock, Zap, Sparkles } from 'lucide-react'
import { playHitSound, playCatchSound, playMissSound } from '../../utils/soundEffects'

function generateProblem(difficulty) {
  const types = ['ADD', 'SUB', 'MUL', 'MISSING']
  const type = types[Math.floor(Math.random() * types.length)]

  let num1, num2, question, answer
  const maxRange = difficulty === 'EASY' ? 15 : difficulty === 'HARD' ? 60 : 30

  if (type === 'ADD') {
    num1 = Math.floor(Math.random() * maxRange) + 5
    num2 = Math.floor(Math.random() * maxRange) + 5
    question = `${num1} + ${num2} = ?`
    answer = num1 + num2
  } else if (type === 'SUB') {
    num1 = Math.floor(Math.random() * maxRange) + 15
    num2 = Math.floor(Math.random() * (num1 - 5)) + 3
    question = `${num1} - ${num2} = ?`
    answer = num1 - num2
  } else if (type === 'MUL') {
    num1 = Math.floor(Math.random() * (difficulty === 'HARD' ? 12 : 9)) + 2
    num2 = Math.floor(Math.random() * (difficulty === 'HARD' ? 12 : 9)) + 2
    question = `${num1} × ${num2} = ?`
    answer = num1 * num2
  } else {
    // Missing number equation
    num1 = Math.floor(Math.random() * 20) + 3
    num2 = Math.floor(Math.random() * 20) + 3
    const sum = num1 + num2
    question = `${num1} + [ ? ] = ${sum}`
    answer = num2
  }

  // Generate 4 distinct options
  const options = new Set([answer])
  while (options.size < 4) {
    const delta = (Math.floor(Math.random() * 5) + 1) * (Math.random() < 0.5 ? -1 : 1)
    const fake = answer + delta
    if (fake >= 0) options.add(fake)
  }

  return {
    question,
    answer,
    options: Array.from(options).sort(() => Math.random() - 0.5),
  }
}

export default function NumberForge({ difficulty = 'MEDIUM', onComplete }) {
  const totalRounds = difficulty === 'EASY' ? 5 : difficulty === 'HARD' ? 10 : 7
  const roundSeconds = difficulty === 'EASY' ? 14 : difficulty === 'HARD' ? 8 : 10

  const [currentRound, setCurrentRound] = useState(1)
  const [problem, setProblem] = useState(null)
  const [selectedAns, setSelectedAns] = useState(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [combo, setCombo] = useState(0)
  const [score, setScore] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [wrongCount, setWrongCount] = useState(0)
  const [timeLeft, setTimeLeft] = useState(roundSeconds)
  const [totalTime, setTotalTime] = useState(0)

  useEffect(() => {
    setProblem(generateProblem(difficulty))
    setCurrentRound(1)
    setCombo(0)
    setScore(0)
    setCorrectCount(0)
    setWrongCount(0)
    setTimeLeft(roundSeconds)
  }, [difficulty, roundSeconds])

  // Total timer
  useEffect(() => {
    const timer = setInterval(() => setTotalTime((t) => t + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  // Question countdown
  useEffect(() => {
    if (isAnswered || !problem) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSelect(null)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [currentRound, isAnswered, problem])

  const handleSelect = (opt) => {
    if (isAnswered) return
    setIsAnswered(true)
    setSelectedAns(opt)

    const isCorrect = opt === problem.answer
    if (isCorrect) {
      playCatchSound()
      const newCombo = combo + 1
      setCombo(newCombo)
      setCorrectCount((c) => c + 1)
      const points = 100 + timeLeft * 10 + newCombo * 20
      setScore((s) => s + points)
    } else {
      playMissSound()
      setCombo(0)
      setWrongCount((w) => w + 1)
    }

    setTimeout(() => {
      if (currentRound >= totalRounds) {
        const finalCorrect = isCorrect ? correctCount + 1 : correctCount
        const accuracy = Math.round((finalCorrect / totalRounds) * 100)
        onComplete({
          score: Math.max(100, score + (isCorrect ? 100 : 0)),
          accuracy,
          timeTakenSeconds: totalTime,
          answersCorrect: finalCorrect,
          answersWrong: wrongCount + (isCorrect ? 0 : 1),
          combo,
          isWon: finalCorrect >= Math.ceil(totalRounds / 2),
        })
      } else {
        setCurrentRound((r) => r + 1)
        setProblem(generateProblem(difficulty))
        setSelectedAns(null)
        setIsAnswered(false)
        setTimeLeft(roundSeconds)
      }
    }, 850)
  }

  if (!problem) return null

  return (
    <div className="flex flex-col items-center justify-between h-full select-none max-w-xl mx-auto w-full">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between px-4 py-2.5 bg-white/5 rounded-2xl border border-white/10 mb-3 font-mono text-xs">
        <div className="flex items-center gap-2">
          <Binary className="w-4 h-4 text-cyan-400" />
          <span className="text-starlight-muted">Forge:</span>
          <span className="text-white font-bold">{currentRound} / {totalRounds}</span>
        </div>

        {combo > 1 && (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1 text-gold font-bold bg-gold/20 px-2.5 py-0.5 rounded-full border border-gold/40"
          >
            <Zap className="w-3.5 h-3.5 fill-gold" />
            <span>{combo}x COMBO</span>
          </motion.div>
        )}

        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-purple-400" />
          <span className={`font-bold ${timeLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-purple-300'}`}>
            {timeLeft}s
          </span>
        </div>
      </div>

      {/* Timer Line */}
      <div className="w-full h-1 bg-white/10 rounded-full mb-4 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-500 to-amber-400"
          animate={{ width: `${(timeLeft / roundSeconds) * 100}%` }}
          transition={{ duration: 0.2 }}
        />
      </div>

      {/* Arithmetic Forge Anvil Display */}
      <div className="w-full glass-card p-6 sm:p-8 rounded-2xl border border-cyan-500/30 bg-midnight/90 shadow-xl mb-4 text-center">
        <div className="text-[11px] font-mono text-starlight-muted mb-2 flex items-center justify-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Smelt the correct calculation:</span>
        </div>
        <motion.h2
          key={problem.question}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="font-title text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-amber-300 tracking-wider"
        >
          {problem.question}
        </motion.h2>
      </div>

      {/* Answer Options */}
      <div className="grid grid-cols-2 gap-3 w-full">
        {problem.options.map((opt, i) => {
          const isChosen = selectedAns === opt
          const isCorrect = opt === problem.answer

          let btnStyle = 'bg-navy/80 hover:bg-white/10 border-white/10 hover:border-cyan-400 text-white font-mono text-xl'
          if (isAnswered) {
            if (isCorrect) {
              btnStyle = 'bg-emerald-500/30 border-emerald-400 text-emerald-200 shadow-glow-gold'
            } else if (isChosen) {
              btnStyle = 'bg-red-500/30 border-red-400 text-red-200'
            } else {
              btnStyle = 'opacity-30 border-white/5 text-white/40'
            }
          }

          return (
            <motion.button
              key={i}
              onClick={() => handleSelect(opt)}
              disabled={isAnswered}
              whileHover={!isAnswered ? { scale: 1.03 } : {}}
              whileTap={!isAnswered ? { scale: 0.95 } : {}}
              className={`p-4 rounded-xl border font-bold transition-all flex items-center justify-center ${btnStyle}`}
            >
              {opt}
            </motion.button>
          )
        })}
      </div>

      {/* Score Tracker */}
      <div className="w-full flex justify-between items-center text-xs font-mono text-starlight-muted mt-4 px-2">
        <span>Score: <strong className="text-gold">{score}</strong></span>
        <span>Accuracy: <strong className="text-cyan-300">{currentRound > 1 ? Math.round((correctCount / (currentRound - 1)) * 100) : 100}%</strong></span>
      </div>
    </div>
  )
}

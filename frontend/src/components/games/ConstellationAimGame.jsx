import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, Sparkles } from 'lucide-react'
import { playHitSound, playMissSound, playCatchSound } from '../../utils/soundEffects'

export default function ConstellationAimGame({ difficulty = 'MEDIUM', onVictory, onDefeat }) {
  const targetStars = difficulty === 'EASY' ? 8 : difficulty === 'HARD' ? 14 : 10
  const maxTime = difficulty === 'EASY' ? 24 : difficulty === 'HARD' ? 18 : 20

  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(maxTime)
  const [activeStars, setActiveStars] = useState([])
  const [connectedNodes, setConnectedNodes] = useState([])
  const [hasEnded, setHasEnded] = useState(false)

  // Timer
  useEffect(() => {
    if (hasEnded) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setHasEnded(true)
          if (score >= targetStars) {
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
  }, [hasEnded, score, targetStars, onVictory, onDefeat])

  // Check victory
  useEffect(() => {
    if (hasEnded) return
    if (score >= targetStars) {
      setHasEnded(true)
      onVictory()
    }
  }, [score, targetStars, hasEnded, onVictory])

  // Spawn star targets
  const spawnStar = useCallback(() => {
    if (hasEnded) return
    const id = Date.now() + Math.random()
    const star = {
      id,
      x: 12 + Math.random() * 76,
      y: 12 + Math.random() * 76,
      number: score + 1,
      lifespan: difficulty === 'HARD' ? 2000 : 2600,
    }

    setActiveStars((prev) => [...prev.slice(-4), star])

    setTimeout(() => {
      setActiveStars((prev) => prev.filter((s) => s.id !== id))
    }, star.lifespan)
  }, [difficulty, hasEnded, score])

  useEffect(() => {
    if (hasEnded) return
    const interval = setInterval(spawnStar, difficulty === 'HARD' ? 750 : 900)
    return () => clearInterval(interval)
  }, [spawnStar, difficulty, hasEnded])

  // Handle hitting a star
  const handleStarClick = (star) => {
    if (hasEnded) return
    playHitSound()
    playCatchSound()

    setActiveStars((prev) => prev.filter((s) => s.id !== star.id))
    setConnectedNodes((prev) => [...prev.slice(-10), { x: star.x, y: star.y }])
    setScore((s) => s + 1)
  }

  return (
    <div className="flex flex-col items-center justify-between h-full select-none">
      {/* HUD */}
      <div className="w-full flex items-center justify-between px-4 py-2 bg-white/5 rounded-xl border border-white/10 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-pink-500/20 border border-pink-400/40 flex items-center justify-center text-pink-300 font-bold">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-starlight-muted uppercase font-mono">Stars Linked</div>
            <div className="text-sm font-bold text-white font-mono">
              <span className="text-pink-400 text-base">{score}</span> / {targetStars}
            </div>
          </div>
        </div>

        {/* Timer */}
        <div className="text-right">
          <div className="text-[10px] text-starlight-muted uppercase font-mono">Time Left</div>
          <div className={`text-sm font-black font-mono ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-pink-300'}`}>
            {timeLeft}s
          </div>
        </div>
      </div>

      {/* Sky Canvas Arena */}
      <div className="w-full h-72 sm:h-80 relative rounded-2xl bg-midnight/90 border border-pink-500/30 overflow-hidden shadow-inner cursor-crosshair">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[11px] text-starlight-muted/80 pointer-events-none flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-pink-400" />
          <span>Click cosmic star nodes to trace the constellation!</span>
        </div>

        {/* SVG Constellation lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {connectedNodes.map((node, i) => {
            if (i === 0) return null
            const prev = connectedNodes[i - 1]
            return (
              <line
                key={i}
                x1={`${prev.x}%`}
                y1={`${prev.y}%`}
                x2={`${node.x}%`}
                y2={`${node.y}%`}
                stroke="rgba(244, 114, 182, 0.6)"
                strokeWidth="2"
                strokeDasharray="4 2"
              />
            )
          })}
        </svg>

        {/* Active Star Targets */}
        <AnimatePresence>
          {activeStars.map((star) => (
            <motion.button
              key={star.id}
              onClick={() => handleStarClick(star)}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.25 }}
              whileTap={{ scale: 0.8 }}
              style={{ left: `${star.x}%`, top: `${star.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center z-10 cursor-pointer"
            >
              {/* Outer pulsing ring */}
              <div className="absolute inset-0 rounded-full border border-pink-400/60 animate-ping" />
              {/* Center core */}
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 border border-white shadow-lg shadow-pink-500/60 flex items-center justify-center text-white text-xs font-black font-mono">
                ✦
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Progress Bar */}
      <div className="w-full mt-3">
        <div className="flex justify-between text-[11px] text-starlight-muted font-mono mb-1">
          <span>CONSTELLATION HARMONY</span>
          <span className="text-pink-300 font-bold">
            {Math.round((score / targetStars) * 100)}%
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 via-pink-400 to-rose-400 rounded-full"
            style={{ width: `${Math.min(100, (score / targetStars) * 100)}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </div>
    </div>
  )
}

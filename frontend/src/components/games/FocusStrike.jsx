import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, Zap, Clock, Sparkles } from 'lucide-react'
import { playSlashSound, playCatchSound, playMissSound } from '../../utils/soundEffects'

export default function FocusStrike({ difficulty = 'MEDIUM', onComplete }) {
  const targetQuota = difficulty === 'EASY' ? 12 : difficulty === 'HARD' ? 24 : 18
  const maxTime = difficulty === 'EASY' ? 25 : difficulty === 'HARD' ? 18 : 20

  const [score, setScore] = useState(0)
  const [hits, setHits] = useState(0)
  const [misses, setMisses] = useState(0)
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [timeLeft, setTimeLeft] = useState(maxTime)
  const [targets, setTargets] = useState([])
  const [lastReactionTime, setLastReactionTime] = useState(null)
  const [reactionTimes, setReactionTimes] = useState([])
  const [hasEnded, setHasEnded] = useState(false)

  // Countdown timer
  useEffect(() => {
    if (hasEnded) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          finishGame()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [hasEnded])

  const finishGame = useCallback(() => {
    setHasEnded(true)
    const totalAttempts = hits + misses
    const accuracy = totalAttempts > 0 ? Math.round((hits / totalAttempts) * 100) : 0
    onComplete({
      score: Math.max(100, score),
      accuracy,
      timeTakenSeconds: maxTime - timeLeft,
      combo: maxCombo,
      answersCorrect: hits,
      answersWrong: misses,
      isWon: hits >= Math.ceil(targetQuota * 0.7),
    })
  }, [hits, misses, score, maxCombo, maxTime, timeLeft, targetQuota, onComplete])

  // Check target quota
  useEffect(() => {
    if (hasEnded) return
    if (hits >= targetQuota) {
      finishGame()
    }
  }, [hits, targetQuota, hasEnded, finishGame])

  // Spawn targets periodically
  const spawnTarget = useCallback(() => {
    if (hasEnded) return
    const id = Date.now() + Math.random()
    const isTrap = Math.random() < (difficulty === 'HARD' ? 0.35 : 0.2)
    const isSwift = !isTrap && Math.random() < 0.25

    const newTarget = {
      id,
      x: 12 + Math.random() * 76,
      y: 12 + Math.random() * 76,
      isTrap,
      isSwift,
      spawnedAt: performance.now(),
      lifespan: isSwift ? 1200 : difficulty === 'HARD' ? 1600 : 2200,
    }

    setTargets((prev) => [...prev.slice(-4), newTarget])

    setTimeout(() => {
      setTargets((prev) => {
        const targetStillThere = prev.find((t) => t.id === id)
        if (targetStillThere && !targetStillThere.isTrap) {
          // Missed valid target
          setCombo(0)
        }
        return prev.filter((t) => t.id !== id)
      })
    }, newTarget.lifespan)
  }, [difficulty, hasEnded])

  useEffect(() => {
    if (hasEnded) return
    const interval = setInterval(spawnTarget, difficulty === 'HARD' ? 650 : 850)
    return () => clearInterval(interval)
  }, [spawnTarget, difficulty, hasEnded])

  const handleTargetClick = (target) => {
    if (hasEnded) return
    const now = performance.now()
    const reactionMs = Math.round(now - target.spawnedAt)

    setTargets((prev) => prev.filter((t) => t.id !== target.id))

    if (target.isTrap) {
      // Hit trap!
      playMissSound()
      setMisses((m) => m + 1)
      setCombo(0)
      setScore((s) => Math.max(0, s - 50))
    } else {
      // Hit good target
      playSlashSound()
      playCatchSound()
      const newCombo = combo + 1
      setCombo(newCombo)
      setMaxCombo((m) => Math.max(m, newCombo))
      setHits((h) => h + 1)
      setLastReactionTime(reactionMs)
      setReactionTimes((r) => [...r, reactionMs])

      const points = target.isSwift ? 200 + newCombo * 25 : 100 + newCombo * 15
      setScore((s) => s + points)
    }
  }

  const avgReaction = reactionTimes.length > 0
    ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
    : 0

  return (
    <div className="flex flex-col items-center justify-between h-full select-none max-w-xl mx-auto w-full">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between px-4 py-2.5 bg-white/5 rounded-2xl border border-white/10 mb-3 font-mono text-xs">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-pink-400" />
          <span className="text-starlight-muted">Strikes:</span>
          <span className="text-white font-bold">{hits} / {targetQuota}</span>
        </div>

        {combo > 1 && (
          <div className="flex items-center gap-1 text-gold font-bold bg-gold/20 px-2.5 py-0.5 rounded-full border border-gold/40">
            <Zap className="w-3.5 h-3.5 fill-gold" />
            <span>{combo}x STRIKE</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span className={`font-bold ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-cyan-300'}`}>
            {timeLeft}s
          </span>
        </div>
      </div>

      {/* Target Arena */}
      <div className="w-full h-72 sm:h-80 relative rounded-2xl bg-midnight/90 border border-pink-500/30 overflow-hidden shadow-inner cursor-crosshair">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[11px] text-starlight-muted/80 pointer-events-none flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-pink-400" />
          <span>Strike golden runes &amp; swift embers • Avoid 🔴 void traps!</span>
        </div>

        <AnimatePresence>
          {targets.map((target) => (
            <motion.button
              key={target.id}
              onClick={() => handleTargetClick(target)}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.8 }}
              style={{ left: `${target.x}%`, top: `${target.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg cursor-pointer z-10 ${
                target.isTrap
                  ? 'bg-red-500/30 border-2 border-red-400 text-red-200 shadow-red-500/50'
                  : target.isSwift
                  ? 'bg-gradient-to-tr from-cyan-400 to-blue-600 border-2 border-white text-white shadow-cyan-500/60 animate-bounce'
                  : 'bg-gradient-to-tr from-amber-400 to-yellow-600 border-2 border-yellow-200 text-midnight shadow-amber-500/60'
              }`}
            >
              <span>{target.isTrap ? '☠️' : target.isSwift ? '⚡' : '✦'}</span>
              <div className="absolute inset-0 rounded-2xl border border-white/40 animate-ping pointer-events-none" />
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Reaction Stats Footer */}
      <div className="w-full flex justify-between items-center text-xs font-mono text-starlight-muted mt-3 px-2">
        <span>Score: <strong className="text-gold">{score}</strong></span>
        <span>Reaction: <strong className="text-cyan-300">{lastReactionTime ? `${lastReactionTime}ms` : '—'}</strong></span>
        <span>Avg: <strong className="text-pink-300">{avgReaction ? `${avgReaction}ms` : '—'}</strong></span>
      </div>
    </div>
  )
}

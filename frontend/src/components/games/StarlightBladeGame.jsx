import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sword, Zap, Sparkles } from 'lucide-react'
import { playSlashSound, playMissSound } from '../../utils/soundEffects'

export default function StarlightBladeGame({ difficulty = 'MEDIUM', onVictory, onDefeat }) {
  const targetHits = difficulty === 'EASY' ? 8 : difficulty === 'HARD' ? 14 : difficulty === 'LEGENDARY' ? 18 : 10
  const maxTime = difficulty === 'EASY' ? 24 : difficulty === 'HARD' ? 18 : 20

  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [timeLeft, setTimeLeft] = useState(maxTime)
  const [targets, setTargets] = useState([])
  const [slashes, setSlashes] = useState([])
  const [hasEnded, setHasEnded] = useState(false)
  const arenaRef = useRef(null)

  // Timer countdown
  useEffect(() => {
    if (hasEnded) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setHasEnded(true)
          if (score >= targetHits) {
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
  }, [hasEnded, score, targetHits, onVictory, onDefeat])

  // Check victory condition as soon as score reaches target
  useEffect(() => {
    if (hasEnded) return
    if (score >= targetHits) {
      setHasEnded(true)
      onVictory()
    }
  }, [score, targetHits, hasEnded, onVictory])

  // Spawn floating cosmic targets periodically
  const spawnTarget = useCallback(() => {
    if (hasEnded) return
    const id = Date.now() + Math.random()
    const runes = ['⚡', '⚔️', '✦', '🔮', '✨', '🗡️']
    const colors = [
      'from-amber-400 to-yellow-500 border-amber-300 shadow-amber-500/50',
      'from-purple-500 to-indigo-600 border-purple-300 shadow-purple-500/50',
      'from-cyan-400 to-blue-600 border-cyan-300 shadow-cyan-500/50',
      'from-emerald-400 to-teal-500 border-emerald-300 shadow-emerald-500/50',
    ]

    const newTarget = {
      id,
      x: 10 + Math.random() * 80, // % from left
      y: 15 + Math.random() * 70, // % from top
      rune: runes[Math.floor(Math.random() * runes.length)],
      colorClass: colors[Math.floor(Math.random() * colors.length)],
      lifespan: difficulty === 'HARD' ? 1700 : 2300,
    }

    setTargets((prev) => [...prev.slice(-7), newTarget])

    // Auto remove after lifespan if not slashed
    setTimeout(() => {
      setTargets((prev) => prev.filter((t) => t.id !== id))
    }, newTarget.lifespan)
  }, [difficulty, hasEnded])

  useEffect(() => {
    if (hasEnded) return
    const interval = setInterval(spawnTarget, difficulty === 'HARD' ? 700 : 900)
    return () => clearInterval(interval)
  }, [spawnTarget, difficulty, hasEnded])

  // Handle slash on target
  const handleSlash = (targetId, x, y) => {
    if (hasEnded) return
    playSlashSound()

    setTargets((prev) => prev.filter((t) => t.id !== targetId))
    setScore((s) => s + 1)
    setCombo((c) => c + 1)

    // Slash particle effect
    const slashId = Date.now()
    setSlashes((prev) => [
      ...prev,
      { id: slashId, x, y, combo: combo + 1 },
    ])

    setTimeout(() => {
      setSlashes((prev) => prev.filter((s) => s.id !== slashId))
    }, 600)
  }

  return (
    <div className="flex flex-col items-center justify-between h-full select-none">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between px-4 py-2 bg-white/5 rounded-xl border border-white/10 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-bold">
            <Sword className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-starlight-muted uppercase font-mono">Hits Needed</div>
            <div className="text-sm font-bold text-white font-mono">
              <span className="text-gold text-base">{score}</span> / {targetHits}
            </div>
          </div>
        </div>

        {/* Combo */}
        {combo > 1 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="px-3 py-0.5 rounded-full bg-gradient-to-r from-purple-500/30 to-amber-500/30 border border-gold/40 text-gold text-xs font-black font-mono shadow-glow-gold"
          >
            {combo}x COMBO!
          </motion.div>
        )}

        {/* Timer */}
        <div className="text-right">
          <div className="text-[10px] text-starlight-muted uppercase font-mono">Time Left</div>
          <div className={`text-sm font-black font-mono ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-cyan-300'}`}>
            {timeLeft}s
          </div>
        </div>
      </div>

      {/* Arena Battlefield */}
      <div
        ref={arenaRef}
        className="w-full h-72 sm:h-80 relative rounded-2xl bg-midnight/90 border border-purple-500/30 overflow-hidden cursor-crosshair shadow-inner"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.12) 0%, transparent 70%)',
        }}
      >
        {/* Instruction hint */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[11px] text-starlight-muted/70 pointer-events-none flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-gold" />
          <span>Slash the floating energy orbs before they fade!</span>
        </div>

        {/* Slashes animation feedback */}
        <AnimatePresence>
          {slashes.map((slash) => (
            <motion.div
              key={slash.id}
              initial={{ scale: 0.5, opacity: 1 }}
              animate={{ scale: 1.4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              style={{ left: `${slash.x}%`, top: `${slash.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 flex flex-col items-center"
            >
              <div className="w-14 h-1.5 bg-gradient-to-r from-transparent via-cyan-300 to-transparent rotate-45 shadow-glow-gold" />
              <span className="text-[10px] font-black text-gold mt-1 font-mono">
                +{slash.combo > 2 ? `${slash.combo * 10} CRIT!` : 'SLASH!'}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Floating targets */}
        <AnimatePresence>
          {targets.map((t) => (
            <motion.button
              key={t.id}
              onClick={() => handleSlash(t.id, t.x, t.y)}
              initial={{ scale: 0, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.7 }}
              transition={{ type: 'spring', damping: 15 }}
              style={{ left: `${t.x}%`, top: `${t.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-gradient-to-br ${t.colorClass} border-2 shadow-lg flex items-center justify-center text-xl active:scale-75 transition-transform cursor-pointer z-10`}
            >
              <span>{t.rune}</span>
              <div className="absolute inset-0 rounded-2xl bg-white/20 animate-pulse pointer-events-none" />
            </motion.button>
          ))}
        </AnimatePresence>

        {/* Floating background particles */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 absolute top-10 left-16 animate-ping" />
          <div className="w-1 h-1 rounded-full bg-purple-400 absolute top-40 right-20 animate-ping" />
          <div className="w-2 h-2 rounded-full bg-amber-400 absolute bottom-12 left-1/3 animate-ping" />
        </div>
      </div>

      {/* Bottom Progress Bar */}
      <div className="w-full mt-3">
        <div className="flex justify-between text-[11px] text-starlight-muted font-mono mb-1">
          <span>TRIAL PROGRESS</span>
          <span className="text-gold font-bold">{Math.round((score / targetHits) * 100)}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 via-cyan-400 to-amber-400 rounded-full"
            style={{ width: `${Math.min(100, (score / targetHits) * 100)}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </div>
    </div>
  )
}

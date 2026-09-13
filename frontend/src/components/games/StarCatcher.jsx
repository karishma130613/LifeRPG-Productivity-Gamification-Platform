import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Shield, Sparkles, Heart, Zap, Clock } from 'lucide-react'
import { playCatchSound, playMissSound } from '../../utils/soundEffects'

export default function StarCatcher({ difficulty = 'MEDIUM', onComplete }) {
  const targetQuota = difficulty === 'EASY' ? 12 : difficulty === 'HARD' ? 24 : 18
  const maxTime = difficulty === 'EASY' ? 30 : difficulty === 'HARD' ? 22 : 25

  const [score, setScore] = useState(0)
  const [starsCaught, setStarsCaught] = useState(0)
  const [lives, setLives] = useState(3)
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [timeLeft, setTimeLeft] = useState(maxTime)
  const [hasEnded, setHasEnded] = useState(false)

  const canvasRef = useRef(null)
  const playerXRef = useRef(150)
  const itemsRef = useRef([])
  const animationFrameRef = useRef(null)
  const hasEndedRef = useRef(false)
  const scoreRef = useRef(0)
  const livesRef = useRef(3)
  const comboRef = useRef(0)
  const starsCaughtRef = useRef(0)

  scoreRef.current = score
  livesRef.current = lives
  comboRef.current = combo
  starsCaughtRef.current = starsCaught
  hasEndedRef.current = hasEnded

  // Countdown timer
  useEffect(() => {
    if (hasEnded) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          finishGame(starsCaughtRef.current >= Math.ceil(targetQuota * 0.6))
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [hasEnded])

  const finishGame = (won) => {
    if (hasEndedRef.current) return
    setHasEnded(true)
    hasEndedRef.current = true
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)

    const finalAccuracy = Math.round((starsCaughtRef.current / (starsCaughtRef.current + (3 - livesRef.current))) * 100)
    onComplete({
      score: Math.max(100, scoreRef.current),
      accuracy: Math.min(100, finalAccuracy || 80),
      timeTakenSeconds: maxTime - timeLeft,
      combo: maxCombo,
      answersCorrect: starsCaughtRef.current,
      answersWrong: 3 - livesRef.current,
      isWon: won,
    })
  }

  // Canvas loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const width = (canvas.width = canvas.parentElement.clientWidth)
    const height = (canvas.height = canvas.parentElement.clientHeight)
    playerXRef.current = width / 2

    // Pointer move listener
    const handlePointerMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      const x = clientX - rect.left
      playerXRef.current = Math.max(35, Math.min(width - 35, x))
    }

    // Keyboard arrow keys
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        playerXRef.current = Math.max(35, playerXRef.current - 24)
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        playerXRef.current = Math.min(width - 35, playerXRef.current + 24)
      }
    }

    window.addEventListener('mousemove', handlePointerMove)
    window.addEventListener('touchmove', handlePointerMove)
    window.addEventListener('keydown', handleKeyDown)

    let spawnTimer = 0
    let lastTime = performance.now()

    const gameLoop = (currentTime) => {
      if (hasEndedRef.current) return
      const dt = (currentTime - lastTime) / 1000
      lastTime = currentTime

      ctx.clearRect(0, 0, width, height)

      // Celestial radial backdrop
      const bgGlow = ctx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, width / 1.5)
      bgGlow.addColorStop(0, 'rgba(124, 58, 237, 0.1)')
      bgGlow.addColorStop(1, 'rgba(11, 14, 23, 0)')
      ctx.fillStyle = bgGlow
      ctx.fillRect(0, 0, width, height)

      // Spawning
      spawnTimer += dt
      const spawnThreshold = difficulty === 'HARD' ? 0.32 : 0.42
      if (spawnTimer > spawnThreshold) {
        spawnTimer = 0
        const isHazard = Math.random() < (difficulty === 'HARD' ? 0.38 : 0.25)
        const isRare = !isHazard && Math.random() < 0.2
        itemsRef.current.push({
          x: 25 + Math.random() * (width - 50),
          y: -15,
          speed: 150 + Math.random() * 100 + (difficulty === 'HARD' ? 50 : 0),
          radius: isHazard ? 13 : isRare ? 14 : 11,
          isHazard,
          isRare,
          angle: 0,
        })
      }

      // Draw Hero Starlight Shield
      const px = playerXRef.current
      const py = height - 26
      const shieldW = 70
      const shieldH = 14

      ctx.save()
      ctx.fillStyle = '#F59E0B'
      ctx.shadowColor = '#FBBF24'
      ctx.shadowBlur = 14
      ctx.beginPath()
      ctx.roundRect(px - shieldW / 2, py, shieldW, shieldH, [8, 8, 3, 3])
      ctx.fill()

      // Center Spirit Crystal
      ctx.fillStyle = '#FFFFFF'
      ctx.beginPath()
      ctx.arc(px, py + shieldH / 2, 4.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // Update falling items
      for (let i = itemsRef.current.length - 1; i >= 0; i--) {
        const item = itemsRef.current[i]
        item.y += item.speed * dt
        item.angle += 3.5 * dt

        // Collision detection
        const dx = Math.abs(item.x - px)
        const dy = Math.abs(item.y - (py + 4))

        if (dx < shieldW / 2 + item.radius && dy < shieldH / 2 + item.radius) {
          itemsRef.current.splice(i, 1)

          if (item.isHazard) {
            playMissSound()
            const newLives = livesRef.current - 1
            setLives(newLives)
            setCombo(0)
            if (newLives <= 0) {
              finishGame(false)
              return
            }
          } else {
            playCatchSound()
            const newCombo = comboRef.current + 1
            setCombo(newCombo)
            setMaxCombo((m) => Math.max(m, newCombo))

            const newCaught = starsCaughtRef.current + 1
            setStarsCaught(newCaught)

            const pts = (item.isRare ? 250 : 100) + newCombo * 15
            setScore((s) => s + pts)

            if (newCaught >= targetQuota) {
              finishGame(true)
              return
            }
          }
          continue
        }

        // Render item
        ctx.save()
        ctx.translate(item.x, item.y)
        ctx.rotate(item.angle)

        if (item.isHazard) {
          ctx.fillStyle = '#EF4444'
          ctx.shadowColor = '#DC2626'
          ctx.shadowBlur = 10
          ctx.beginPath()
          ctx.arc(0, 0, item.radius, 0, Math.PI * 2)
          ctx.fill()

          ctx.fillStyle = '#18181B'
          ctx.beginPath()
          ctx.arc(0, 0, item.radius - 4, 0, Math.PI * 2)
          ctx.fill()
        } else if (item.isRare) {
          ctx.fillStyle = '#38BDF8'
          ctx.shadowColor = '#818CF8'
          ctx.shadowBlur = 14
          ctx.beginPath()
          ctx.arc(0, 0, item.radius, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = '#FFFFFF'
          ctx.beginPath()
          ctx.arc(0, 0, item.radius * 0.4, 0, Math.PI * 2)
          ctx.fill()
        } else {
          ctx.fillStyle = '#FBBF24'
          ctx.shadowColor = '#F59E0B'
          ctx.shadowBlur = 12
          ctx.beginPath()
          for (let p = 0; p < 5; p++) {
            const rot = (Math.PI / 5) * (p * 2)
            const rOut = item.radius
            const rIn = item.radius * 0.45
            ctx.lineTo(Math.cos(rot) * rOut, Math.sin(rot) * rOut)
            ctx.lineTo(Math.cos(rot + Math.PI / 5) * rIn, Math.sin(rot + Math.PI / 5) * rIn)
          }
          ctx.closePath()
          ctx.fill()
        }
        ctx.restore()

        if (item.y > height + 20) {
          itemsRef.current.splice(i, 1)
        }
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop)
    }

    animationFrameRef.current = requestAnimationFrame(gameLoop)

    return () => {
      window.removeEventListener('mousemove', handlePointerMove)
      window.removeEventListener('touchmove', handlePointerMove)
      window.removeEventListener('keydown', handleKeyDown)
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [difficulty, targetQuota])

  return (
    <div className="flex flex-col items-center justify-between h-full select-none max-w-xl mx-auto w-full">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between px-4 py-2.5 bg-white/5 rounded-2xl border border-white/10 mb-3 font-mono text-xs">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span className="text-starlight-muted">Stars:</span>
          <span className="text-white font-bold">{starsCaught} / {targetQuota}</span>
        </div>

        {combo > 1 && (
          <div className="flex items-center gap-1 text-gold font-bold bg-gold/20 px-2.5 py-0.5 rounded-full border border-gold/40">
            <Zap className="w-3.5 h-3.5 fill-gold" />
            <span>{combo}x COMBO</span>
          </div>
        )}

        <div className="flex items-center gap-3">
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

          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className={`font-bold ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-cyan-300'}`}>
              {timeLeft}s
            </span>
          </div>
        </div>
      </div>

      {/* Arcade Canvas */}
      <div className="w-full h-72 sm:h-80 relative rounded-2xl bg-midnight/90 border border-emerald-500/30 overflow-hidden shadow-inner">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[11px] text-starlight-muted/80 pointer-events-none flex items-center gap-1 z-10">
          <Sparkles className="w-3 h-3 text-gold" />
          <span>Move mouse/touch/arrow keys • Catch ⭐ stars, dodge 🔴 void orbs!</span>
        </div>
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Bottom Progress Bar */}
      <div className="w-full mt-3">
        <div className="flex justify-between text-[11px] text-starlight-muted font-mono mb-1">
          <span>STARLIGHT HARVEST</span>
          <span className="text-gold font-bold">{Math.round((starsCaught / targetQuota) * 100)}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-full"
            style={{ width: `${Math.min(100, (starsCaught / targetQuota) * 100)}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </div>
    </div>
  )
}

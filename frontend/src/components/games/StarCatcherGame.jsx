import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Shield, Sparkles, Heart } from 'lucide-react'
import { playCatchSound, playMissSound } from '../../utils/soundEffects'

export default function StarCatcherGame({ difficulty = 'MEDIUM', onVictory, onDefeat }) {
  const targetStars = difficulty === 'EASY' ? 8 : difficulty === 'HARD' ? 14 : 10
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [hasEnded, setHasEnded] = useState(false)

  const canvasRef = useRef(null)
  const playerXRef = useRef(150)
  const itemsRef = useRef([])
  const animationFrameRef = useRef(null)
  const hasEndedRef = useRef(false)
  const scoreRef = useRef(0)
  const livesRef = useRef(3)

  scoreRef.current = score
  livesRef.current = lives
  hasEndedRef.current = hasEnded

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const width = (canvas.width = canvas.parentElement.clientWidth)
    const height = (canvas.height = canvas.parentElement.clientHeight)
    playerXRef.current = width / 2

    // Mouse / Touch movement
    const handlePointerMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      const x = clientX - rect.left
      playerXRef.current = Math.max(30, Math.min(width - 30, x))
    }

    window.addEventListener('mousemove', handlePointerMove)
    window.addEventListener('touchmove', handlePointerMove)

    // Spawning items
    let spawnTimer = 0
    let lastTime = performance.now()

    const gameLoop = (currentTime) => {
      if (hasEndedRef.current) return
      const dt = (currentTime - lastTime) / 1000
      lastTime = currentTime

      // Clear screen
      ctx.clearRect(0, 0, width, height)

      // Background starlight glow
      const grad = ctx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, width / 1.5)
      grad.addColorStop(0, 'rgba(124, 58, 237, 0.08)')
      grad.addColorStop(1, 'rgba(11, 14, 23, 0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, width, height)

      // Spawn falling items
      spawnTimer += dt
      if (spawnTimer > (difficulty === 'HARD' ? 0.35 : 0.45)) {
        spawnTimer = 0
        const isHazard = Math.random() < (difficulty === 'HARD' ? 0.38 : 0.28)
        itemsRef.current.push({
          x: 20 + Math.random() * (width - 40),
          y: -15,
          speed: 160 + Math.random() * 100,
          radius: isHazard ? 13 : 11,
          isHazard,
          angle: 0,
        })
      }

      // Draw player shield
      const playerX = playerXRef.current
      const playerY = height - 26
      const shieldWidth = 64
      const shieldHeight = 14

      ctx.save()
      ctx.fillStyle = '#F59E0B'
      ctx.shadowColor = '#FBBF24'
      ctx.shadowBlur = 12
      ctx.beginPath()
      ctx.roundRect(playerX - shieldWidth / 2, playerY, shieldWidth, shieldHeight, [6, 6, 2, 2])
      ctx.fill()

      // Center crystal on shield
      ctx.fillStyle = '#FFFFFF'
      ctx.beginPath()
      ctx.arc(playerX, playerY + shieldHeight / 2, 4, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // Update and draw falling items
      for (let i = itemsRef.current.length - 1; i >= 0; i--) {
        const item = itemsRef.current[i]
        item.y += item.speed * dt
        item.angle += 3 * dt

        // Collision detection with shield
        const dx = Math.abs(item.x - playerX)
        const dy = Math.abs(item.y - (playerY + 4))

        if (dx < shieldWidth / 2 + item.radius && dy < shieldHeight / 2 + item.radius) {
          itemsRef.current.splice(i, 1)

          if (item.isHazard) {
            playMissSound()
            const newLives = livesRef.current - 1
            setLives(newLives)
            if (newLives <= 0) {
              setHasEnded(true)
              onDefeat()
              return
            }
          } else {
            playCatchSound()
            const newScore = scoreRef.current + 1
            setScore(newScore)
            if (newScore >= targetStars) {
              setHasEnded(true)
              onVictory()
              return
            }
          }
          continue
        }

        // Draw item
        ctx.save()
        ctx.translate(item.x, item.y)
        ctx.rotate(item.angle)

        if (item.isHazard) {
          // Void Hazard (Red/Purple Spiky Orb)
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
        } else {
          // Golden Starlight Star
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

        // Remove off-screen items
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
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [difficulty, targetStars, onVictory, onDefeat])

  return (
    <div className="flex flex-col items-center justify-between h-full select-none">
      {/* HUD */}
      <div className="w-full flex items-center justify-between px-4 py-2 bg-white/5 rounded-xl border border-white/10 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 font-bold">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-starlight-muted uppercase font-mono">Stars Caught</div>
            <div className="text-sm font-bold text-white font-mono">
              <span className="text-gold text-base">{score}</span> / {targetStars}
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

      {/* Canvas Game Arena */}
      <div className="w-full h-72 sm:h-80 relative rounded-2xl bg-midnight/90 border border-emerald-500/30 overflow-hidden shadow-inner">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[11px] text-starlight-muted/80 pointer-events-none flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-gold" />
          <span>Move mouse/touch to catch ⭐ stars, dodge 🔴 void orbs!</span>
        </div>
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Progress Bar */}
      <div className="w-full mt-3">
        <div className="flex justify-between text-[11px] text-starlight-muted font-mono mb-1">
          <span>STARLIGHT HARVEST</span>
          <span className="text-gold font-bold">
            {Math.round((score / targetStars) * 100)}%
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-full"
            style={{ width: `${Math.min(100, (score / targetStars) * 100)}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </div>
    </div>
  )
}

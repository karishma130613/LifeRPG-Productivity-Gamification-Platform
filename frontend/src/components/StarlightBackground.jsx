import { useEffect, useRef } from 'react'
import { useTheme } from '../context/ThemeContext'

export default function StarlightBackground() {
  const canvasRef = useRef(null)
  const { isDay } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // NIGHT: Stars
    const stars = Array.from({ length: 220 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight * 0.75,
      r: Math.random() * 1.6 + 0.3,
      twinkleSpeed: Math.random() * 0.04 + 0.008,
      twinkleOffset: Math.random() * Math.PI * 2,
      alpha: Math.random() * 0.6 + 0.4,
      color: ['rgba(220,210,255,', 'rgba(210,230,255,', 'rgba(255,250,220,', 'rgba(200,220,255,'][Math.floor(Math.random() * 4)],
    }))

    // NIGHT: Moon craters
    const craters = [
      { rx: -9, ry: -6, r: 5, depth: 0.35 },
      { rx:  8, ry:  4, r: 3, depth: 0.25 },
      { rx: -3, ry: 10, r: 4, depth: 0.30 },
      { rx: 10, ry: -9, r: 2.5, depth: 0.20 },
      { rx: -14, ry: 3, r: 3.5, depth: 0.28 },
      { rx:  5, ry: -13, r: 2, depth: 0.18 },
      { rx: -6, ry: -14, r: 1.8, depth: 0.15 },
    ]

    // DAY: Clouds
    const clouds = Array.from({ length: 7 }, (_, i) => ({
      x: (i * 0.16 + 0.03) * window.innerWidth,
      y: (0.08 + i * 0.04 + (i % 2) * 0.08) * window.innerHeight,
      width: 140 + Math.random() * 120,
      height: 50 + Math.random() * 40,
      speed: 0.15 + Math.random() * 0.12,
      alpha: 0.45 + Math.random() * 0.35,
    }))

    const drawMountains = (dayMode) => {
      const h = canvas.height
      const w = canvas.width
      if (dayMode) {
        ctx.beginPath()
        ctx.moveTo(0, h * 0.78)
        ctx.lineTo(w * 0.08, h * 0.52)
        ctx.lineTo(w * 0.18, h * 0.65)
        ctx.lineTo(w * 0.30, h * 0.42)
        ctx.lineTo(w * 0.42, h * 0.60)
        ctx.lineTo(w * 0.55, h * 0.38)
        ctx.lineTo(w * 0.67, h * 0.55)
        ctx.lineTo(w * 0.80, h * 0.44)
        ctx.lineTo(w * 0.92, h * 0.56)
        ctx.lineTo(w, h * 0.50)
        ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath()
        const mtGrad = ctx.createLinearGradient(0, h * 0.4, 0, h)
        mtGrad.addColorStop(0, 'rgba(100, 140, 180, 0.65)')
        mtGrad.addColorStop(0.5, 'rgba(80, 110, 150, 0.75)')
        mtGrad.addColorStop(1, 'rgba(60, 85, 120, 0.90)')
        ctx.fillStyle = mtGrad; ctx.fill()
        ctx.beginPath()
        ctx.moveTo(0, h * 0.88)
        ctx.lineTo(w * 0.15, h * 0.74)
        ctx.lineTo(w * 0.32, h * 0.82)
        ctx.lineTo(w * 0.50, h * 0.70)
        ctx.lineTo(w * 0.68, h * 0.80)
        ctx.lineTo(w * 0.85, h * 0.73)
        ctx.lineTo(w, h * 0.80)
        ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath()
        const fgGrad = ctx.createLinearGradient(0, h * 0.7, 0, h)
        fgGrad.addColorStop(0, 'rgba(50, 90, 60, 0.85)')
        fgGrad.addColorStop(1, 'rgba(30, 60, 40, 0.95)')
        ctx.fillStyle = fgGrad; ctx.fill()
        const mist = ctx.createLinearGradient(0, h * 0.68, 0, h * 0.90)
        mist.addColorStop(0, 'rgba(200, 220, 240, 0)')
        mist.addColorStop(1, 'rgba(180, 210, 235, 0.35)')
        ctx.fillStyle = mist; ctx.fillRect(0, h * 0.68, w, h * 0.32)
      } else {
        ctx.beginPath()
        ctx.moveTo(0, h * 0.80)
        ctx.lineTo(w * 0.10, h * 0.54)
        ctx.lineTo(w * 0.22, h * 0.67)
        ctx.lineTo(w * 0.35, h * 0.44)
        ctx.lineTo(w * 0.48, h * 0.61)
        ctx.lineTo(w * 0.60, h * 0.41)
        ctx.lineTo(w * 0.72, h * 0.57)
        ctx.lineTo(w * 0.85, h * 0.47)
        ctx.lineTo(w, h * 0.59)
        ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath()
        ctx.fillStyle = 'rgba(10, 8, 28, 0.96)'; ctx.fill()
        const fog = ctx.createLinearGradient(0, h * 0.72, 0, h * 0.88)
        fog.addColorStop(0, 'rgba(11, 15, 25, 0)')
        fog.addColorStop(1, 'rgba(8, 10, 20, 0.82)')
        ctx.fillStyle = fog; ctx.fillRect(0, h * 0.72, w, h * 0.28)
      }
    }

    const drawMoon = (t) => {
      const moonX = canvas.width * 0.78
      const moonY = canvas.height * 0.14
      const R = 30
      for (let i = 3; i >= 1; i--) {
        const glow = ctx.createRadialGradient(moonX, moonY, R, moonX, moonY, R + i * 40)
        glow.addColorStop(0, `rgba(200, 185, 255, ${0.07 / i})`)
        glow.addColorStop(1, 'rgba(150, 130, 220, 0)')
        ctx.fillStyle = glow
        ctx.beginPath(); ctx.arc(moonX, moonY, R + i * 40, 0, Math.PI * 2); ctx.fill()
      }
      const moonBase = ctx.createRadialGradient(moonX - R * 0.25, moonY - R * 0.2, R * 0.05, moonX, moonY, R)
      moonBase.addColorStop(0, 'rgba(252, 248, 240, 1.0)')
      moonBase.addColorStop(0.5, 'rgba(235, 228, 210, 0.97)')
      moonBase.addColorStop(1, 'rgba(195, 185, 165, 0.92)')
      ctx.beginPath(); ctx.arc(moonX, moonY, R, 0, Math.PI * 2)
      ctx.fillStyle = moonBase
      ctx.shadowBlur = 18; ctx.shadowColor = 'rgba(210, 195, 255, 0.7)'; ctx.fill(); ctx.shadowBlur = 0
      const terminator = ctx.createRadialGradient(moonX + R * 0.55, moonY, R * 0.2, moonX + R * 0.55, moonY, R * 1.1)
      terminator.addColorStop(0, 'rgba(15, 12, 35, 0.0)')
      terminator.addColorStop(0.6, 'rgba(15, 12, 35, 0.12)')
      terminator.addColorStop(1, 'rgba(15, 12, 35, 0.45)')
      ctx.beginPath(); ctx.arc(moonX, moonY, R, 0, Math.PI * 2); ctx.fillStyle = terminator; ctx.fill()
      ctx.save()
      ctx.beginPath(); ctx.arc(moonX, moonY, R, 0, Math.PI * 2); ctx.clip()
      craters.forEach(c => {
        const cx2 = moonX + c.rx; const cy2 = moonY + c.ry
        const cg = ctx.createRadialGradient(cx2 - c.r * 0.3, cy2 - c.r * 0.3, c.r * 0.1, cx2, cy2, c.r)
        cg.addColorStop(0, `rgba(245, 235, 215, ${0.3 * (1 - c.depth)})`)
        cg.addColorStop(0.5, `rgba(160, 148, 120, ${c.depth * 0.65})`)
        cg.addColorStop(0.85, `rgba(80, 70, 55, ${c.depth * 0.55})`)
        cg.addColorStop(1, `rgba(180, 170, 145, ${c.depth * 0.3})`)
        ctx.beginPath(); ctx.arc(cx2, cy2, c.r, 0, Math.PI * 2); ctx.fillStyle = cg; ctx.fill()
      })
      ctx.restore()
    }

    const drawSun = (t) => {
      const sunX = canvas.width * 0.72
      const sunY = canvas.height * 0.14
      const R = 36
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + t * 0.08
        const rayLen = R + 50 + Math.sin(t * 1.5 + i) * 12
        ctx.save(); ctx.translate(sunX, sunY); ctx.rotate(angle)
        const rg = ctx.createLinearGradient(R, 0, rayLen, 0)
        rg.addColorStop(0, 'rgba(255, 230, 100, 0.22)')
        rg.addColorStop(0.5, 'rgba(255, 210, 60, 0.10)')
        rg.addColorStop(1, 'rgba(255, 200, 40, 0)')
        ctx.fillStyle = rg
        ctx.beginPath(); ctx.moveTo(R - 2, -4); ctx.lineTo(rayLen + 5, -1.5)
        ctx.lineTo(rayLen + 5, 1.5); ctx.lineTo(R - 2, 4); ctx.closePath(); ctx.fill()
        ctx.restore()
      }
      const coronaRings = [
        { r: R + 80, alpha: 0.04 }, { r: R + 55, alpha: 0.07 },
        { r: R + 32, alpha: 0.12 }, { r: R + 14, alpha: 0.22 },
      ]
      coronaRings.forEach(({ r, alpha }) => {
        const glow = ctx.createRadialGradient(sunX, sunY, R, sunX, sunY, r)
        glow.addColorStop(0, `rgba(255, 240, 120, ${alpha})`)
        glow.addColorStop(1, 'rgba(255, 180, 0, 0)')
        ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(sunX, sunY, r, 0, Math.PI * 2); ctx.fill()
      })
      const disk = ctx.createRadialGradient(sunX - R * 0.2, sunY - R * 0.2, R * 0.1, sunX, sunY, R)
      disk.addColorStop(0, 'rgba(255, 252, 210, 1.0)')
      disk.addColorStop(0.4, 'rgba(255, 235, 80, 1.0)')
      disk.addColorStop(0.8, 'rgba(255, 200, 30, 0.97)')
      disk.addColorStop(1, 'rgba(250, 165, 0, 0.88)')
      ctx.beginPath(); ctx.arc(sunX, sunY, R, 0, Math.PI * 2)
      ctx.fillStyle = disk; ctx.shadowBlur = 28; ctx.shadowColor = 'rgba(255, 220, 60, 0.85)'; ctx.fill(); ctx.shadowBlur = 0
      const flares = [
        { dist: -0.55, r: 8,  alpha: 0.18, color: 'rgba(180, 210, 255,' },
        { dist: -0.30, r: 5,  alpha: 0.14, color: 'rgba(255, 240, 180,' },
        { dist:  0.20, r: 10, alpha: 0.10, color: 'rgba(200, 180, 255,' },
        { dist:  0.45, r: 6,  alpha: 0.13, color: 'rgba(255, 220, 120,' },
        { dist:  0.70, r: 4,  alpha: 0.09, color: 'rgba(150, 200, 255,' },
      ]
      const fax = canvas.width * 0.5 - sunX; const fay = canvas.height * 0.5 - sunY
      flares.forEach(f => {
        const fx = sunX + fax * f.dist; const fy = sunY + fay * f.dist
        const fg2 = ctx.createRadialGradient(fx, fy, 0, fx, fy, f.r)
        fg2.addColorStop(0, `${f.color}${f.alpha})`)
        fg2.addColorStop(1, `${f.color}0)`)
        ctx.fillStyle = fg2; ctx.beginPath(); ctx.arc(fx, fy, f.r, 0, Math.PI * 2); ctx.fill()
      })
    }

    const drawClouds = () => {
      clouds.forEach(cloud => {
        cloud.x += cloud.speed
        if (cloud.x > canvas.width + cloud.width) cloud.x = -cloud.width
        const cx = cloud.x; const cy = cloud.y; const w = cloud.width; const h = cloud.height
        const cg2 = ctx.createRadialGradient(cx + w * 0.3, cy, h * 0.2, cx + w * 0.3, cy, h * 0.85)
        cg2.addColorStop(0, `rgba(255, 255, 255, ${cloud.alpha})`)
        cg2.addColorStop(0.6, `rgba(240, 248, 255, ${cloud.alpha * 0.8})`)
        cg2.addColorStop(1, 'rgba(210, 235, 255, 0)')
        ctx.fillStyle = cg2
        ctx.beginPath(); ctx.ellipse(cx + w * 0.35, cy + h * 0.3, w * 0.38, h * 0.42, 0, 0, Math.PI * 2); ctx.fill()
        ctx.beginPath(); ctx.ellipse(cx + w * 0.12, cy + h * 0.45, w * 0.22, h * 0.35, 0, 0, Math.PI * 2); ctx.fill()
        ctx.beginPath(); ctx.ellipse(cx + w * 0.62, cy + h * 0.42, w * 0.28, h * 0.38, 0, 0, Math.PI * 2); ctx.fill()
        ctx.beginPath(); ctx.ellipse(cx + w * 0.40, cy + h * 0.10, w * 0.20, h * 0.32, 0, 0, Math.PI * 2); ctx.fill()
      })
    }

    let animFrame
    let t = 0
    const animate = () => {
      t += 0.005
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const day = isDay
      if (day) {
        const sky = ctx.createLinearGradient(0, 0, 0, canvas.height)
        sky.addColorStop(0, '#0a1f40')
        sky.addColorStop(0.22, '#1a4a8a')
        sky.addColorStop(0.45, '#3a7fc0')
        sky.addColorStop(0.70, '#7bb8d8')
        sky.addColorStop(0.85, '#c8e6f0')
        sky.addColorStop(1, '#ddeef5')
        ctx.fillStyle = sky; ctx.fillRect(0, 0, canvas.width, canvas.height)
        const horizGlow = ctx.createRadialGradient(
          canvas.width * 0.5, canvas.height * 0.72, 0,
          canvas.width * 0.5, canvas.height * 0.72, canvas.width * 0.65
        )
        horizGlow.addColorStop(0, 'rgba(255, 220, 100, 0.22)')
        horizGlow.addColorStop(0.5, 'rgba(255, 180, 50, 0.08)')
        horizGlow.addColorStop(1, 'rgba(255, 160, 0, 0)')
        ctx.fillStyle = horizGlow; ctx.fillRect(0, 0, canvas.width, canvas.height)
        drawSun(t); drawClouds()
      } else {
        const sky = ctx.createLinearGradient(0, 0, 0, canvas.height)
        sky.addColorStop(0, '#020408')
        sky.addColorStop(0.4, '#060a14')
        sky.addColorStop(0.7, '#0b0f1c')
        sky.addColorStop(1, '#0d1124')
        ctx.fillStyle = sky; ctx.fillRect(0, 0, canvas.width, canvas.height)
        const nebula = ctx.createRadialGradient(
          canvas.width * 0.78, canvas.height * 0.12, 0,
          canvas.width * 0.78, canvas.height * 0.12, canvas.width * 0.45
        )
        nebula.addColorStop(0, 'rgba(50, 30, 90, 0.10)')
        nebula.addColorStop(1, 'rgba(5, 5, 20, 0)')
        ctx.fillStyle = nebula; ctx.fillRect(0, 0, canvas.width, canvas.height)
        stars.forEach(s => {
          const alpha = s.alpha * (0.45 + 0.55 * Math.sin(t * (s.twinkleSpeed * 200) + s.twinkleOffset))
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
          ctx.fillStyle = `${s.color}${alpha})`; ctx.fill()
        })
        drawMoon(t)
      }
      drawMountains(day)
      animFrame = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animFrame)
      window.removeEventListener('resize', resize)
    }
  }, [isDay])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  )
}

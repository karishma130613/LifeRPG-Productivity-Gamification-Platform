import { motion } from 'framer-motion'

export function XPBar({ current, max, level, className = '' }) {
  const pct = max > 0 ? Math.min((current / max) * 100, 100) : 0
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex justify-between text-xs text-starlight-dim">
        <span>Level {level}</span>
        <span>{current?.toLocaleString()} / {max?.toLocaleString()} XP</span>
      </div>
      <div className="xp-bar-track">
        <motion.div
          className="xp-bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

export function GoldCounter({ amount, animate: doAnimate = false }) {
  return (
    <motion.span
      className="flex items-center gap-1.5 font-semibold text-gold"
      animate={doAnimate ? { scale: [1, 1.15, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      <span className="text-lg leading-none">💰</span>
      <span>{amount?.toLocaleString()}</span>
    </motion.span>
  )
}

export function StreakCounter({ streak }) {
  return (
    <motion.span
      className="flex items-center gap-1.5 font-semibold text-orange-400"
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <span className="text-lg leading-none">🔥</span>
      <span>{streak} Day{streak !== 1 ? 's' : ''}</span>
    </motion.span>
  )
}

export function AttributeBar({ label, value, max = 100, color = 'purple-glow' }) {
  const pct = Math.min((value / max) * 100, 100)
  const colorMap = {
    'purple-glow': 'from-purple-muted to-purple-glow',
    'gold':        'from-gold-dark to-gold',
    'emerald':     'from-emerald-600 to-emerald-400',
    'cyan':        'from-cyan-600 to-cyan-400',
    'pink':        'from-pink-600 to-pink-400',
  }
  const barColor = colorMap[color] || colorMap['purple-glow']
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-xs">
        <span className="text-starlight-dim font-medium">{label}</span>
        <span className="text-starlight font-semibold">{value}</span>
      </div>
      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

export function StatCard({ icon, label, value, color = 'purple' }) {
  const colorMap = { purple: 'text-lavender', gold: 'text-gold', orange: 'text-orange-400', green: 'text-emerald-400' }
  return (
    <div className="stat-card rounded-xl">
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-xs text-starlight-dim">{label}</p>
        <p className={`text-sm font-bold ${colorMap[color] || 'text-starlight'}`}>{value}</p>
      </div>
    </div>
  )
}

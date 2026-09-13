import { motion } from 'framer-motion'
import { Heart, Shield, Skull, Swords } from 'lucide-react'

export default function BossCard({ boss }) {
  if (!boss) return null
  const hpPct = Math.max(0, (boss.currentHp / boss.maxHp) * 100)
  const hpColor = hpPct > 60 ? 'from-emerald-600 to-emerald-400' : hpPct > 30 ? 'from-gold-dark to-gold' : 'from-red-700 to-red-400'

  return (
    <motion.div
      className="glass-card rounded-2xl p-5 border border-red-500/20"
      whileHover={{ y: -2 }}
    >
      {/* Boss header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center flex-shrink-0">
          {boss.isDefeated
            ? <Skull className="w-7 h-7 text-red-400 opacity-50" />
            : <Shield className="w-7 h-7 text-red-400" />
          }
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-sm font-bold text-red-300">{boss.title}</h3>
          <p className="font-semibold text-starlight">{boss.name}</p>
          {boss.description && <p className="text-xs text-starlight-dim mt-0.5 line-clamp-2">{boss.description}</p>}
        </div>
      </div>

      {/* HP Bar */}
      {!boss.isDefeated ? (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-red-400 font-medium flex items-center gap-1">
              <Heart className="w-3 h-3" /> Boss HP
            </span>
            <span className="text-starlight font-semibold">
              {boss.currentHp?.toLocaleString()} / {boss.maxHp?.toLocaleString()}
            </span>
          </div>
          <div className="hp-bar-track">
            <motion.div
              className={`hp-bar-fill bg-gradient-to-r ${hpColor}`}
              animate={{ width: `${hpPct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <p className="text-xs text-starlight-dim">
            Assign quests to this boss to deal damage!
          </p>
        </div>
      ) : (
        <div className="text-center py-2">
          <p className="text-emerald-400 font-bold text-sm">✨ BOSS DEFEATED! ✨</p>
          <p className="text-xs text-starlight-dim mt-1">Legendary victory achieved!</p>
        </div>
      )}

      {/* Rewards preview */}
      <div className="flex gap-4 mt-3 pt-3 border-t border-white/10">
        <span className="text-xs text-purple-glow font-medium">Defeat: +{boss.xpReward} XP</span>
        <span className="text-xs text-gold font-medium">+{boss.goldReward} Gold</span>
      </div>
    </motion.div>
  )
}

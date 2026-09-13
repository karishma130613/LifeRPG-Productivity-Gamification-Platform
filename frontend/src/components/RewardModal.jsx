import { motion } from 'framer-motion'
import { CheckCircle, Zap, Coins, Flame, Trophy } from 'lucide-react'
import { useGame } from '../context/GameContext'

export default function RewardModal() {
  const { rewardData, closeReward } = useGame()
  if (!rewardData) return null

  const { xpGained, goldGained, streakGained, attributeGained, achievementsUnlocked, regionsUnlocked, bossDefeated, quest } = rewardData

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Quest Complete!">
      <motion.div
        className="modal-content max-w-sm border border-purple-glow/30"
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      >
        {/* Header */}
        <div className="text-center mb-5">
          <motion.div
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.5 }}
          >
            <CheckCircle className="w-14 h-14 text-emerald-400 mx-auto mb-2" />
          </motion.div>
          <h2 className="font-display text-2xl font-bold text-starlight">Quest Complete! ✨</h2>
          {quest?.title && <p className="text-sm text-starlight-dim mt-1 truncate">{quest.title}</p>}
        </div>

        {/* Rewards */}
        <div className="space-y-2 mb-5">
          {xpGained > 0 && (
            <motion.div
              className="flex items-center gap-3 glass-card rounded-xl px-4 py-3 border border-purple-glow/20"
              initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}
            >
              <Zap className="w-5 h-5 text-purple-glow" />
              <span className="text-starlight font-semibold text-lg">+{xpGained} XP</span>
            </motion.div>
          )}
          {goldGained > 0 && (
            <motion.div
              className="flex items-center gap-3 glass-card rounded-xl px-4 py-3 border border-gold/20"
              initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}
            >
              <span className="text-xl">💰</span>
              <span className="text-gold font-semibold text-lg">+{goldGained} Gold</span>
            </motion.div>
          )}
          {streakGained > 0 && (
            <motion.div
              className="flex items-center gap-3 glass-card rounded-xl px-4 py-3 border border-orange-400/20"
              initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}
            >
              <Flame className="w-5 h-5 text-orange-400" />
              <span className="text-orange-400 font-semibold">Streak +1! 🔥</span>
            </motion.div>
          )}
          {attributeGained && (
            <motion.div
              className="flex items-center gap-3 glass-card rounded-xl px-4 py-3 border border-lavender/20"
              initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}
            >
              <span className="text-lavender font-semibold">⬆ {attributeGained} +1</span>
            </motion.div>
          )}
          {achievementsUnlocked?.map((a, i) => (
            <motion.div
              key={a}
              className="flex items-center gap-3 glass-card rounded-xl px-4 py-3 border border-gold/30 bg-gold/5"
              initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 + i * 0.1 }}
            >
              <Trophy className="w-5 h-5 text-gold" />
              <span className="text-gold font-semibold text-sm">{a} Unlocked!</span>
            </motion.div>
          ))}
          {bossDefeated && (
            <motion.div
              className="glass-card rounded-xl px-4 py-3 border border-red-400/30 bg-red-500/10 text-center"
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6, type: 'spring' }}
            >
              <p className="text-red-300 font-bold">⚔️ BOSS DEFEATED! ⚔️</p>
            </motion.div>
          )}
          {regionsUnlocked?.map(r => (
            <motion.div
              key={r}
              className="glass-card rounded-xl px-4 py-3 border border-emerald-400/30 bg-emerald-500/10 text-center"
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.7, type: 'spring' }}
            >
              <p className="text-emerald-300 font-bold">🌍 {r} Unlocked!</p>
            </motion.div>
          ))}
        </div>

        <button onClick={closeReward} className="btn-primary w-full">
          Awesome! Continue
        </button>
      </motion.div>
    </div>
  )
}

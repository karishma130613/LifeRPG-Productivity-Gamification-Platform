import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../context/GameContext'

export default function FloatingRewards() {
  const { floatingXP, floatingGold } = useGame()

  return (
    <div className="fixed inset-0 pointer-events-none z-50" aria-hidden="true">
      <AnimatePresence>
        {floatingXP.map(f => (
          <motion.div
            key={f.id}
            className="absolute font-display font-bold text-lg text-purple-glow drop-shadow-lg"
            style={{ left: `${f.x}%`, top: `${f.y}%` }}
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: -60, scale: 1.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
          >
            +{f.amount} XP ✨
          </motion.div>
        ))}
        {floatingGold.map(f => (
          <motion.div
            key={f.id}
            className="absolute font-display font-bold text-lg text-gold drop-shadow-lg"
            style={{ left: `${f.x}%`, top: `${f.y}%` }}
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: -60, scale: 1.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: 'easeOut', delay: 0.2 }}
          >
            +{f.amount} 💰
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

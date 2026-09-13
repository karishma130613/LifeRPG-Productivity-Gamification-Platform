import { motion } from 'framer-motion'
import { Star, Sparkles, Globe } from 'lucide-react'
import { useGame } from '../context/GameContext'
import LumiCompanion from './LumiCompanion'

export default function LevelUpModal() {
  const { levelUpData, closeLevelUp } = useGame()
  if (!levelUpData) return null

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Level Up!">
      <motion.div
        className="modal-content text-center border border-gold/30 bg-navy/95 max-w-md relative overflow-hidden"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* Gold shimmer bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-dark via-gold-light to-gold-dark" />
        
        {/* Stars decoration */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-gold-light text-lg"
            style={{
              top: `${10 + Math.random() * 30}%`,
              left: `${5 + i * 12}%`,
            }}
            animate={{ y: [-5, 5, -5], rotate: [0, 180, 360], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2 + i * 0.3, repeat: Infinity }}
          >✦</motion.div>
        ))}

        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Star className="w-12 h-12 text-gold mx-auto mb-3" fill="currentColor" />
        </motion.div>

        <motion.h2
          className="font-display text-4xl font-black text-gradient-gold mb-1"
          animate={{ scale: [0.8, 1.1, 1] }}
          transition={{ duration: 0.5 }}
        >
          LEVEL UP!
        </motion.h2>
        <p className="text-starlight-dim mb-4 text-sm">
          Level {levelUpData.oldLevel} → Level{' '}
          <span className="text-lavender font-bold text-xl">{levelUpData.newLevel}</span>
        </p>

        {/* Attribute gains */}
        {levelUpData.regionsUnlocked?.length > 0 && (
          <div className="glass-card rounded-xl p-3 mb-4 border border-gold/20">
            {levelUpData.regionsUnlocked.map(r => (
              <div key={r} className="flex items-center gap-2 text-sm text-gold">
                <Globe className="w-4 h-4" /> <span>{r} Unlocked!</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center mb-4">
          <LumiCompanion size="md" showSpeech={false} />
        </div>

        <p className="text-sm text-lavender mb-5 font-medium">
          <Sparkles className="w-4 h-4 inline mr-1" />
          Your journey grows stronger with every step!
        </p>

        <button onClick={closeLevelUp} className="btn-gold w-full text-base">
          Continue Adventure!
        </button>
      </motion.div>
    </div>
  )
}

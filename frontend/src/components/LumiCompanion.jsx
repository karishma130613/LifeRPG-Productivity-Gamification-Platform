import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../context/GameContext'

// Lumi SVG states
const LumiBody = ({ state }) => {
  const bounce = state === 'celebrating' || state === 'victory' || state === 'happy'
  const excited = state === 'excited' || state === 'levelup'

  return (
    <svg viewBox="0 0 80 80" className="w-full h-full" aria-label="Lumi your companion">
      {/* Glow aura */}
      <defs>
        <radialGradient id="lumiGlow" cx="50%" cy="60%" r="50%">
          <stop offset="0%" stopColor={state === 'celebrating' ? '#F59E0B' : '#8B5CF6'} stopOpacity="0.4" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="bodyGrad" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#C084FC" />
          <stop offset="100%" stopColor="#6D28D9" />
        </radialGradient>
      </defs>

      {/* Aura glow */}
      <ellipse cx="40" cy="48" rx="30" ry="24" fill="url(#lumiGlow)" />

      {/* Main body — rounded star creature */}
      <motion.ellipse
        cx="40" cy="44" rx="20" ry="22"
        fill="url(#bodyGrad)"
        animate={bounce ? { scaleY: [1, 1.08, 0.95, 1.05, 1] } : {}}
        transition={{ duration: 0.6, repeat: bounce ? Infinity : 0, repeatDelay: 1 }}
      />

      {/* Ear / points */}
      <polygon points="28,26 23,14 33,22" fill="#A855F7" opacity="0.9" />
      <polygon points="52,26 57,14 47,22" fill="#A855F7" opacity="0.9" />

      {/* Eyes */}
      <motion.g
        animate={excited ? { scaleY: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.4, repeat: excited ? Infinity : 0, repeatDelay: 0.8 }}
      >
        <ellipse cx="34" cy="40" rx="4" ry={state === 'thinking' ? 2 : 4.5} fill="#1E1B4B" />
        <ellipse cx="46" cy="40" rx="4" ry={state === 'thinking' ? 2 : 4.5} fill="#1E1B4B" />
        {/* Eye shine */}
        <circle cx="35.5" cy="38" r="1.2" fill="white" opacity="0.9" />
        <circle cx="47.5" cy="38" r="1.2" fill="white" opacity="0.9" />
      </motion.g>

      {/* Cheek blush */}
      <ellipse cx="27" cy="46" rx="4" ry="2.5" fill="#F9A8D4" opacity="0.5" />
      <ellipse cx="53" cy="46" rx="4" ry="2.5" fill="#F9A8D4" opacity="0.5" />

      {/* Mouth */}
      {state === 'thinking' ? (
        <line x1="35" y1="50" x2="45" y2="50" stroke="#1E1B4B" strokeWidth="2" strokeLinecap="round" />
      ) : (
        <path d="M35 49 Q40 54 45 49" stroke="#1E1B4B" strokeWidth="2" fill="none" strokeLinecap="round" />
      )}

      {/* Magic star accessory */}
      <motion.g
        animate={{ rotate: [0, 20, -20, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '54px 22px' }}
      >
        <text x="48" y="26" fontSize="10" fill="#FCD34D">✦</text>
      </motion.g>

      {/* Celebration sparkles */}
      <AnimatePresence>
        {(state === 'celebrating' || state === 'victory') && (
          <>
            {[...Array(5)].map((_, i) => (
              <motion.text
                key={i}
                x={20 + i * 10}
                y={10 + (i % 2) * 8}
                fontSize="8"
                fill="#FCD34D"
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: [0, 1, 0], y: -15 }}
                transition={{ delay: i * 0.15, duration: 0.8, repeat: Infinity, repeatDelay: 0.5 }}
              >✨</motion.text>
            ))}
          </>
        )}
      </AnimatePresence>
    </svg>
  )
}

export default function LumiCompanion({ size = 'md', showSpeech = true }) {
  const { lumiMessage, lumiState } = useGame()

  const sizes = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
    xl: 'w-40 h-40',
  }

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Speech Bubble */}
      <AnimatePresence mode="wait">
        {showSpeech && lumiMessage && (
          <motion.div
            key={lumiMessage}
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className="relative max-w-xs px-4 py-2 glass-card border border-purple-glow/30 rounded-2xl text-center"
          >
            <p className="text-xs text-starlight leading-relaxed">{lumiMessage}</p>
            {/* Bubble tail */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-white/5 border-r border-b border-purple-glow/30" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lumi body */}
      <motion.div
        className={`${sizes[size]} relative cursor-default select-none`}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        aria-label={`Lumi companion - ${lumiState}`}
      >
        <LumiBody state={lumiState} />
      </motion.div>
    </div>
  )
}

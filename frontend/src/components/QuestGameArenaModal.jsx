import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trophy, RefreshCw, Zap, Coins, Sword, Brain, Terminal, Shield, Target, Sparkles, Play } from 'lucide-react'
import StarlightBladeGame from './games/StarlightBladeGame'
import RuneMemoryGame from './games/RuneMemoryGame'
import SpellTyperGame from './games/SpellTyperGame'
import StarCatcherGame from './games/StarCatcherGame'
import ConstellationAimGame from './games/ConstellationAimGame'
import { playVictoryFanfare, playDefeatSound } from '../utils/soundEffects'

const GAME_TYPES = [
  {
    id: 'RHYTHM_SLASH',
    name: 'Starlight Blade',
    desc: 'Reflex slash floating cosmic runes before they fade',
    icon: Sword,
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  },
  {
    id: 'RUNE_MEMORY',
    name: 'Astral Rune Memory',
    desc: 'Recall and replicate glowing arcane rune patterns',
    icon: Brain,
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
  },
  {
    id: 'SPELL_TYPER',
    name: 'Spell Incantation Typer',
    desc: 'Type mystical focus words to cast the completion spell',
    icon: Terminal,
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
  },
  {
    id: 'ORB_DODGE',
    name: 'Celestial Star Catcher',
    desc: 'Steer your spirit shield to harvest falling stars and dodge void orbs',
    icon: Shield,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  },
  {
    id: 'CONSTELLATION_AIM',
    name: 'Constellation Archer',
    desc: 'Aim and click star nodes to trace the constellation path',
    icon: Target,
    color: 'text-pink-400 bg-pink-500/10 border-pink-500/30',
  },
]

export function getRecommendedGame(category = '') {
  const cat = category.toUpperCase()
  if (cat.includes('FITNESS')) return 'RHYTHM_SLASH'
  if (cat.includes('STUDY') || cat.includes('READ') || cat.includes('MIND')) return 'RUNE_MEMORY'
  if (cat.includes('CODE') || cat.includes('CAREER')) return 'SPELL_TYPER'
  if (cat.includes('HABIT') || cat.includes('VITALITY') || cat.includes('DISCIPLINE')) return 'ORB_DODGE'
  return 'CONSTELLATION_AIM'
}

export default function QuestGameArenaModal({ quest, onClose, onVictoryComplete }) {
  const initialGameType = quest.gameType || getRecommendedGame(quest.category)
  const [selectedGame, setSelectedGame] = useState(initialGameType)
  const [gameState, setGameState] = useState('READY') // 'READY', 'PLAYING', 'VICTORY', 'DEFEAT'
  const [completing, setCompleting] = useState(false)

  // Reset to READY if quest changes
  useEffect(() => {
    setSelectedGame(quest.gameType || getRecommendedGame(quest.category))
    setGameState('READY')
  }, [quest])

  const handleStartGame = () => {
    setGameState('PLAYING')
  }

  const handleVictory = () => {
    playVictoryFanfare()
    setGameState('VICTORY')
  }

  const handleDefeat = () => {
    playDefeatSound()
    setGameState('DEFEAT')
  }

  const handleClaimVictory = async () => {
    if (completing) return
    setCompleting(true)
    try {
      await onVictoryComplete(quest.id)
      onClose()
    } catch (err) {
      console.error('Failed to complete quest after victory:', err)
      setCompleting(false)
    }
  }

  const activeGameMeta = GAME_TYPES.find((g) => g.id === selectedGame) || GAME_TYPES[0]
  const ActiveGameIcon = activeGameMeta.icon

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-midnight/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 15 }}
        className="w-full max-w-2xl glass-card rounded-3xl border border-purple-500/30 bg-midnight/95 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between gap-3 bg-gradient-to-r from-purple-900/40 via-midnight to-midnight">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gold/20 text-gold border border-gold/30">
                Quest Trial Arena
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-starlight-muted">
                {quest.category}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/20 text-purple-300">
                {quest.difficulty || 'MEDIUM'}
              </span>
            </div>
            <h2 className="font-title text-base sm:text-lg font-bold text-white line-clamp-1">
              {quest.title}
            </h2>
          </div>

          {/* Rewards pill + Close */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
              <span className="flex items-center gap-1 text-purple-300 font-bold">
                <Zap className="w-3.5 h-3.5 text-purple-400" />
                +{quest.xpReward} XP
              </span>
              <span className="text-white/20">|</span>
              <span className="flex items-center gap-1 text-gold font-bold">
                <Coins className="w-3.5 h-3.5 text-gold" />
                +{quest.goldReward}
              </span>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-starlight-muted hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Game Selector Tabs (Enabled when in READY or DEFEAT state) */}
        {(gameState === 'READY' || gameState === 'DEFEAT') && (
          <div className="px-4 pt-3 pb-1 border-b border-white/5 bg-white/[0.02]">
            <div className="text-[11px] font-mono uppercase text-starlight-muted mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>Select Your Quest Trial Game:</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {GAME_TYPES.map((game) => {
                const Icon = game.icon
                const isSelected = selectedGame === game.id
                return (
                  <button
                    key={game.id}
                    onClick={() => setSelectedGame(game.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-all ${
                      isSelected
                        ? 'bg-purple-600/30 text-white border border-purple-400 shadow-glow-gold'
                        : 'bg-white/5 text-starlight-muted hover:text-white border border-white/5'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{game.name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Main Body Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {/* 1. READY STATE */}
            {gameState === 'READY' && (
              <motion.div
                key="ready"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center text-center space-y-5 py-4"
              >
                <div className={`w-20 h-20 rounded-3xl p-1 bg-gradient-to-br from-purple-500/40 to-amber-500/30 border border-white/20 shadow-glow-gold flex items-center justify-center`}>
                  <ActiveGameIcon className="w-10 h-10 text-gold" />
                </div>

                <div className="space-y-1 max-w-md">
                  <h3 className="font-title text-xl sm:text-2xl font-bold text-white">
                    {activeGameMeta.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-starlight-muted leading-relaxed">
                    {activeGameMeta.desc}. Win this trial to prove your real-life triumph and claim your rewards!
                  </p>
                </div>

                {/* Trial Specs */}
                <div className="grid grid-cols-2 gap-3 w-full max-w-sm text-xs font-mono">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center">
                    <span className="text-starlight-muted text-[10px]">TRIAL DIFFICULTY</span>
                    <span className="font-bold text-purple-300 mt-0.5">{quest.difficulty || 'MEDIUM'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center">
                    <span className="text-starlight-muted text-[10px]">VICTORY REWARD</span>
                    <span className="font-bold text-gold mt-0.5">+{quest.xpReward} XP / +{quest.goldReward} G</span>
                  </div>
                </div>

                <button
                  onClick={handleStartGame}
                  className="btn-gold px-8 py-3 rounded-2xl text-sm font-black tracking-wide flex items-center gap-2.5 shadow-glow-gold hover:scale-105 transition-all"
                >
                  <Play className="w-4 h-4 fill-midnight" />
                  <span>Begin Quest Trial</span>
                </button>
              </motion.div>
            )}

            {/* 2. PLAYING STATE */}
            {gameState === 'PLAYING' && (
              <motion.div
                key="playing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex-1"
              >
                {selectedGame === 'RHYTHM_SLASH' && (
                  <StarlightBladeGame
                    difficulty={quest.difficulty}
                    onVictory={handleVictory}
                    onDefeat={handleDefeat}
                  />
                )}
                {selectedGame === 'RUNE_MEMORY' && (
                  <RuneMemoryGame
                    difficulty={quest.difficulty}
                    onVictory={handleVictory}
                    onDefeat={handleDefeat}
                  />
                )}
                {selectedGame === 'SPELL_TYPER' && (
                  <SpellTyperGame
                    difficulty={quest.difficulty}
                    onVictory={handleVictory}
                    onDefeat={handleDefeat}
                  />
                )}
                {selectedGame === 'ORB_DODGE' && (
                  <StarCatcherGame
                    difficulty={quest.difficulty}
                    onVictory={handleVictory}
                    onDefeat={handleDefeat}
                  />
                )}
                {selectedGame === 'CONSTELLATION_AIM' && (
                  <ConstellationAimGame
                    difficulty={quest.difficulty}
                    onVictory={handleVictory}
                    onDefeat={handleDefeat}
                  />
                )}
              </motion.div>
            )}

            {/* 3. VICTORY STATE */}
            {gameState === 'VICTORY' && (
              <motion.div
                key="victory"
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center text-center space-y-5 py-6"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-200 p-0.5 shadow-glow-gold animate-bounce">
                  <div className="w-full h-full rounded-full bg-midnight flex items-center justify-center">
                    <Trophy className="w-10 h-10 text-gold" />
                  </div>
                </div>

                <div>
                  <h3 className="font-title text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
                    QUEST TRIAL CONQUERED!
                  </h3>
                  <p className="text-xs sm:text-sm text-starlight-muted mt-1">
                    You triumphed in the trial and manifested your real-world progress!
                  </p>
                </div>

                {/* Rewards showcase */}
                <div className="flex items-center justify-center gap-4 p-4 rounded-2xl bg-white/5 border border-gold/30 shadow-glow-gold w-full max-w-sm">
                  <div className="flex items-center gap-2 text-purple-300 font-mono text-base font-black">
                    <Zap className="w-5 h-5 text-purple-400" />
                    <span>+{quest.xpReward} XP</span>
                  </div>
                  <div className="w-px h-6 bg-white/10" />
                  <div className="flex items-center gap-2 text-gold font-mono text-base font-black">
                    <Coins className="w-5 h-5 text-gold" />
                    <span>+{quest.goldReward} Gold</span>
                  </div>
                </div>

                <button
                  onClick={handleClaimVictory}
                  disabled={completing}
                  className="btn-gold px-8 py-3.5 rounded-2xl text-sm font-black tracking-wide flex items-center gap-2 shadow-glow-gold hover:scale-105 transition-all"
                >
                  <Sparkles className="w-4 h-4 fill-midnight" />
                  <span>{completing ? 'Inscribing Victory...' : 'Claim Victory & Complete Quest'}</span>
                </button>
              </motion.div>
            )}

            {/* 4. DEFEAT / RETRY STATE */}
            {gameState === 'DEFEAT' && (
              <motion.div
                key="defeat"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center text-center space-y-5 py-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                  <RefreshCw className="w-8 h-8" />
                </div>

                <div className="space-y-1 max-w-md">
                  <h3 className="font-title text-xl font-bold text-white">
                    The Trial Held Strong
                  </h3>
                  <p className="text-xs sm:text-sm text-starlight-muted leading-relaxed">
                    No progress is lost! Gather your focus, adjust your timing, and strike the trial again.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleStartGame}
                    className="btn-primary px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Retry Trial</span>
                  </button>

                  <button
                    onClick={() => setGameState('READY')}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-starlight-muted hover:text-white"
                  >
                    Change Game
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

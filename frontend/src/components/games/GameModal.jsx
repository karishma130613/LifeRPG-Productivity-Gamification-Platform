import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trophy, RefreshCw, Zap, Coins, Play, Sparkles, Shield, Heart, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { gameService } from '../../services/services'
import { useGame } from '../../context/GameContext'
import { playVictoryFanfare, playDefeatSound } from '../../utils/soundEffects'
import LumiCompanion from '../LumiCompanion'

// Import all 6 mini games
import MemoryStars from './MemoryStars'
import MindMaze from './MindMaze'
import NumberForge from './NumberForge'
import FocusStrike from './FocusStrike'
import WordQuest from './WordQuest'
import StarCatcher from './StarCatcher'

const GAME_COMPONENTS = {
  'memory-stars': MemoryStars,
  'mind-maze': MindMaze,
  'number-forge': NumberForge,
  'focus-strike': FocusStrike,
  'word-quest': WordQuest,
  'star-catcher': StarCatcher,
}

export default function GameModal({ game, linkedQuestId = null, onClose, onGameFinished }) {
  const { updateCharacter, triggerLevelUp, spawnFloatingXP, spawnFloatingGold } = useGame()

  const [difficulty, setDifficulty] = useState('MEDIUM')
  const [gameState, setGameState] = useState('START') // 'START', 'PLAYING', 'RESULT'
  const [sessionId, setSessionId] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [gameResult, setGameResult] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  const availableDiffs = game?.availableDifficulties || ['EASY', 'MEDIUM', 'HARD']

  const handleStartSession = async () => {
    setErrorMsg('')
    try {
      const session = await gameService.startGame(game.id, { difficulty, linkedQuestId })
      setSessionId(session.sessionId)
      setGameState('PLAYING')
    } catch (err) {
      console.error('Failed to start game session:', err)
      setErrorMsg(err.response?.data?.message || 'Failed to start game session. Please try again.')
    }
  }

  const handleGameComplete = async (gamePayload) => {
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      const payload = {
        ...gamePayload,
        sessionId,
      }

      const result = await gameService.completeGame(game.id, payload)
      setGameResult(result)

      if (result.updatedCharacter) {
        updateCharacter(result.updatedCharacter)
      }

      if (gamePayload.isWon) {
        playVictoryFanfare()
        spawnFloatingXP(result.xpEarned || 75)
        spawnFloatingGold(result.goldEarned || 30)

        if (result.leveledUp) {
          triggerLevelUp(result)
        }
      } else {
        playDefeatSound()
      }

      setGameState('RESULT')
      if (onGameFinished) {
        onGameFinished(result)
      }
    } catch (err) {
      console.error('Failed to validate game session:', err)
      setErrorMsg(err.response?.data?.message || 'Failed to record game trial.')
      setGameState('START')
    } finally {
      setIsSubmitting(false)
    }
  }

  const ActiveComponent = GAME_COMPONENTS[game?.id] || MemoryStars

  // Estimated rewards calculation preview
  const rewardPreview = {
    EASY: { xp: 50, gold: 20, damage: 30 },
    MEDIUM: { xp: 75, gold: 30, damage: 50 },
    HARD: { xp: 100, gold: 50, damage: 75 },
    EPIC: { xp: 150, gold: 75, damage: 100 },
  }[difficulty] || { xp: 75, gold: 30, damage: 50 }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-midnight/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 15 }}
        className="w-full max-w-2xl glass-card rounded-3xl border border-purple-500/30 bg-midnight/95 shadow-2xl overflow-hidden flex flex-col max-h-[94vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between gap-3 bg-gradient-to-r from-purple-900/30 via-navy to-midnight">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500/30 to-amber-500/20 border border-purple-400/40 flex items-center justify-center text-gold font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono tracking-wider text-purple-300 font-bold bg-purple-500/20 px-2 py-0.5 rounded-full">
                  {game?.zoneName || 'Game Realm'}
                </span>
                <span className="text-[10px] text-starlight-muted font-mono">
                  {game?.attributeType} Trial
                </span>
              </div>
              <h2 className="font-title text-lg sm:text-xl font-bold text-white">
                {game?.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-starlight-muted hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Container */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col justify-center relative">
          <AnimatePresence mode="wait">
            {/* 1. START SCREEN */}
            {gameState === 'START' && (
              <motion.div
                key="start"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="flex flex-col items-center text-center space-y-5 py-2 max-w-md mx-auto w-full"
              >
                <div className="space-y-1">
                  <h3 className="font-title text-xl font-bold text-white">{game?.name}</h3>
                  <p className="text-xs sm:text-sm text-starlight-muted leading-relaxed">
                    {game?.description}
                  </p>
                </div>

                {/* Difficulty Selector */}
                <div className="w-full space-y-1.5 text-left">
                  <span className="text-[11px] font-mono uppercase text-starlight-muted font-bold">
                    Select Difficulty:
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {availableDiffs.map((diff) => (
                      <button
                        key={diff}
                        onClick={() => setDifficulty(diff)}
                        className={`py-2 px-3 rounded-xl text-xs font-mono font-bold border transition-all ${
                          difficulty === diff
                            ? 'bg-purple-600/40 border-purple-400 text-white shadow-glow-gold scale-102'
                            : 'bg-white/5 border-white/10 text-starlight-muted hover:text-white'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rewards Preview Card */}
                <div className="grid grid-cols-3 gap-2.5 w-full font-mono text-xs">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center">
                    <span className="text-[10px] text-starlight-muted">XP HARVEST</span>
                    <span className="font-black text-purple-300 text-sm mt-1 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-purple-400" />
                      +{rewardPreview.xp}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center">
                    <span className="text-[10px] text-starlight-muted">GOLD COINS</span>
                    <span className="font-black text-gold text-sm mt-1 flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5 text-gold" />
                      +{rewardPreview.gold}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center">
                    <span className="text-[10px] text-starlight-muted">BOSS STRIKE</span>
                    <span className="font-black text-red-400 text-sm mt-1 flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-red-400" />
                      -{rewardPreview.damage} HP
                    </span>
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl p-2.5 w-full font-mono">
                    {errorMsg}
                  </p>
                )}

                <button
                  onClick={handleStartSession}
                  className="btn-gold px-8 py-3.5 rounded-2xl text-sm font-black tracking-wide flex items-center gap-2 shadow-glow-gold hover:scale-105 active:scale-95 transition-all w-full justify-center"
                >
                  <Play className="w-4 h-4 fill-midnight" />
                  <span>Begin Challenge Trial</span>
                </button>
              </motion.div>
            )}

            {/* 2. ACTIVE GAME SCREEN */}
            {gameState === 'PLAYING' && (
              <motion.div
                key="playing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex-1 flex flex-col justify-center"
              >
                <ActiveComponent
                  difficulty={difficulty}
                  onComplete={handleGameComplete}
                />
              </motion.div>
            )}

            {/* 3. RESULT & REWARD SCREEN */}
            {gameState === 'RESULT' && gameResult && (
              <motion.div
                key="result"
                initial={{ scale: 0.88, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center text-center space-y-4 py-2 max-w-md mx-auto w-full"
              >
                {/* Victory or Try Again Header */}
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-200 p-0.5 shadow-glow-gold flex items-center justify-center animate-bounce">
                  <div className="w-full h-full rounded-3xl bg-midnight flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-gold" />
                  </div>
                </div>

                <div>
                  <h3 className="font-title text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-white to-amber-400">
                    {gameResult.score >= 100 ? 'QUEST TRIAL CONQUERED!' : 'TRIAL COMPLETE!'}
                  </h3>
                  <p className="text-xs text-starlight-muted mt-0.5 font-mono">
                    Score: <span className="text-gold font-bold">{gameResult.score}</span> • Accuracy: <span className="text-cyan-300 font-bold">{gameResult.accuracy}%</span>
                  </p>
                </div>

                {/* RPG Rewards Grid */}
                <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 flex flex-col items-center">
                    <span className="text-[10px] text-starlight-muted">XP EARNED</span>
                    <span className="text-purple-300 font-bold mt-0.5">+{gameResult.xpEarned} XP</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col items-center">
                    <span className="text-[10px] text-starlight-muted">GOLD HARVEST</span>
                    <span className="text-gold font-bold mt-0.5">+{gameResult.goldEarned} G</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 flex flex-col items-center">
                    <span className="text-[10px] text-starlight-muted">BOSS DAMAGE</span>
                    <span className="text-red-400 font-bold mt-0.5">-{gameResult.bossDamageDealt} HP</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex flex-col items-center">
                    <span className="text-[10px] text-starlight-muted">LIFE DNA</span>
                    <span className="text-cyan-300 font-bold mt-0.5">{gameResult.attributeBoosted || '+1 Stat'}</span>
                  </div>
                </div>

                {/* Boss Battle Status */}
                {gameResult.bossDefeated && (
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-red-900/40 to-amber-900/30 border border-red-500/50 w-full text-xs">
                    <span className="font-bold text-gold">💥 BOSS VANQUISHED!</span>
                    <p className="text-starlight-muted mt-0.5">You dealt the final blow to {gameResult.bossName || 'the Boss'}!</p>
                  </div>
                )}

                {/* Streak Badge */}
                {gameResult.currentStreak > 0 && (
                  <div className="flex items-center justify-between p-2.5 px-4 rounded-xl bg-white/5 border border-white/10 w-full text-xs font-mono">
                    <span className="text-starlight-muted">Daily Game Streak:</span>
                    <span className="text-gold font-bold">🔥 {gameResult.currentStreak} Day{gameResult.currentStreak > 1 ? 's' : ''}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 w-full pt-1">
                  <button
                    onClick={() => {
                      setGameState('START')
                      setGameResult(null)
                    }}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Play Again</span>
                  </button>

                  <button
                    onClick={onClose}
                    className="btn-gold p-3 rounded-xl text-xs font-black shadow-glow-gold flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Back to Realm</span>
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

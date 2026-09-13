import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Clock, Trash2, Edit3, Zap, Coins, Shield, Lock, ChevronRight } from 'lucide-react'

const categoryColors = {
  Study:      'text-blue-400  bg-blue-400/10',
  Coding:     'text-cyan-400  bg-cyan-400/10',
  Career:     'text-gold      bg-gold/10',
  Fitness:    'text-emerald-400 bg-emerald-400/10',
  Reading:    'text-purple-glow bg-purple-glow/10',
  Creativity: 'text-pink-400  bg-pink-400/10',
  Personal:   'text-lavender  bg-lavender/10',
  Other:      'text-starlight-dim bg-white/5',
}

const difficultyLabel = { EASY: '★', MEDIUM: '★★', HARD: '★★★', LEGENDARY: '★★★★' }

export default function QuestCard({ quest, onComplete, onEdit, onDelete, disabled = false }) {
  const [completing, setCompleting] = useState(false)
  const isCompleted = quest.status === 'COMPLETED'
  const isLocked    = quest.status === 'LOCKED'
  const catStyle    = categoryColors[quest.category] || categoryColors.Other

  const handleComplete = async () => {
    if (completing || isCompleted || isLocked || disabled) return
    onComplete(quest)
  }

  return (
    <motion.div
      layout
      className={`glass-card rounded-2xl p-4 transition-all duration-200 ${isCompleted ? 'opacity-60 border-white/5' : 'hover:border-purple-glow/20'}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={!isCompleted ? { y: -1 } : {}}
    >
      <div className="flex items-start gap-3">
        {/* Completion button */}
        <motion.button
          onClick={handleComplete}
          disabled={isCompleted || isLocked || disabled || completing}
          className={`flex-shrink-0 mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
            ${isCompleted
              ? 'border-emerald-400 bg-emerald-400/20 text-emerald-400'
              : isLocked
              ? 'border-white/20 bg-white/5 text-white/20 cursor-not-allowed'
              : 'border-purple-glow/60 hover:border-purple-glow hover:bg-purple-glow/10 cursor-pointer'
            }`}
          whileTap={!isCompleted && !isLocked ? { scale: 0.8 } : {}}
          aria-label={isCompleted ? 'Quest completed' : 'Complete quest'}
        >
          {isCompleted ? (
            <CheckCircle className="w-4 h-4" />
          ) : isLocked ? (
            <Lock className="w-3 h-3" />
          ) : completing ? (
            <motion.div className="w-3 h-3 border border-purple-glow border-t-transparent rounded-full"
              animate={{ rotate: 360 }} transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }} />
          ) : null}
        </motion.button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`font-medium text-sm leading-tight ${isCompleted ? 'line-through text-starlight-dim' : 'text-starlight'}`}>
              {quest.title}
            </h3>
            {/* Actions */}
            {!isCompleted && !isLocked && (
              <div className="flex gap-1 flex-shrink-0">
                {onEdit && (
                  <button onClick={() => onEdit(quest)} className="btn-icon text-starlight-dim hover:text-starlight" aria-label="Edit quest">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}
                {onDelete && (
                  <button onClick={() => onDelete(quest.id)} className="btn-icon text-starlight-dim hover:text-red-400" aria-label="Delete quest">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>

          {quest.description && (
            <p className="text-xs text-starlight-dim mt-0.5 line-clamp-1">{quest.description}</p>
          )}

          {/* Tags row */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${catStyle}`}>
              {quest.category}
            </span>
            <span className={`badge-${quest.difficulty?.toLowerCase() || 'medium'}`}>
              {difficultyLabel[quest.difficulty] || '★★'} {quest.difficulty}
            </span>

            {/* Rewards */}
            <span className="flex items-center gap-1 text-xs text-purple-glow font-medium">
              <Zap className="w-3 h-3" />{quest.xpReward} XP
            </span>
            <span className="flex items-center gap-1 text-xs text-gold font-medium">
              <Coins className="w-3 h-3" />{quest.goldReward}
            </span>

            {quest.dueDate && (
              <span className="flex items-center gap-1 text-xs text-starlight-dim">
                <Clock className="w-3 h-3" />{quest.dueDate}
              </span>
            )}
            {quest.bossId && (
              <span className="flex items-center gap-1 text-xs text-red-400">
                <Shield className="w-3 h-3" />Boss
              </span>
            )}
            {isCompleted && <span className="badge-completed">Completed</span>}
            {isLocked    && <span className="badge-locked">Locked</span>}

            {/* Trial Game Badge */}
            {!isCompleted && !isLocked && (
              <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-gradient-to-r from-purple-500/20 to-amber-500/20 border border-purple-400/30 text-purple-200 flex items-center gap-1">
                <span>🎮</span>
                <span>
                  {quest.gameType === 'RHYTHM_SLASH' ? 'Starlight Blade'
                    : quest.gameType === 'RUNE_MEMORY' ? 'Rune Memory'
                    : quest.gameType === 'SPELL_TYPER' ? 'Spell Typer'
                    : quest.gameType === 'ORB_DODGE' ? 'Star Catcher'
                    : quest.gameType === 'CONSTELLATION_AIM' ? 'Cosmic Aim'
                    : 'Quest Trial'}
                </span>
              </span>
            )}
          </div>

          {/* Quick Play Trial CTA for Active Quests */}
          {!isCompleted && !isLocked && (
            <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between">
              <span className="text-[11px] text-starlight-muted font-mono">
                Win trial to complete
              </span>
              <button
                onClick={handleComplete}
                disabled={disabled || completing}
                className="px-3 py-1 rounded-xl text-xs font-bold bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 hover:text-white border border-purple-500/40 hover:border-purple-400 transition-all flex items-center gap-1.5 shadow-sm hover:shadow-glow-gold active:scale-95"
              >
                <span>⚔️ Play Trial</span>
                <ChevronRight className="w-3.5 h-3.5 text-gold" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

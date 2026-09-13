import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  Sparkles,
  Dna,
  Calendar,
  Flame,
  Zap,
  Target,
  Clock,
  Compass,
  Award
} from 'lucide-react'
import { characterService, questService } from '../services/services'
import { useGame } from '../context/GameContext'

export default function ProgressPage() {
  const { character, updateCharacter } = useGame()
  const [quests, setQuests] = useState([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const [charData, questData] = await Promise.allSettled([
        characterService.getCharacter(),
        questService.getQuests({ status: 'COMPLETED' }),
      ])
      if (charData.status === 'fulfilled') updateCharacter(charData.value)
      if (questData.status === 'fulfilled') setQuests(questData.value || [])
    } catch (err) {
      console.error('Failed to load progress analytics:', err)
    } finally {
      setLoading(false)
    }
  }, [updateCharacter])

  useEffect(() => {
    loadData()
  }, [loadData])

  const currentLevel = character?.level || 1
  const completedCount = character?.totalQuestsCompleted || quests.length || 0
  const totalXp = character?.totalXp || 0
  const streak = character?.currentStreak || 0

  // Future Self Projections
  const estimatedDaysToNextLevel = Math.max(1, Math.ceil(((character?.nextLevelXp || 100) - (character?.currentXp || 0)) / 35))
  const estimatedDaysToLevel10 = Math.max(1, (10 - currentLevel) * 4)

  const attributes = [
    { name: 'Strength', val: character?.strength || 10, color: 'bg-red-500' },
    { name: 'Intellect', val: character?.intellect || 10, color: 'bg-blue-500' },
    { name: 'Discipline', val: character?.discipline || 10, color: 'bg-amber-500' },
    { name: 'Creativity', val: character?.creativity || 10, color: 'bg-purple-500' },
    { name: 'Vitality', val: character?.vitality || 10, color: 'bg-emerald-500' },
    { name: 'Charisma', val: character?.charisma || 10, color: 'bg-pink-500' },
  ]

  const maxAttr = Math.max(...attributes.map((a) => a.val), 20)

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 lg:p-8 glass-card rounded-3xl border border-white/10 relative overflow-hidden">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
            <TrendingUp className="w-3.5 h-3.5 text-gold" />
            <span>Temporal Analytics</span>
          </div>
          <h1 className="font-title text-3xl sm:text-4xl font-extrabold text-white">
            Future Self & Trajectory
          </h1>
          <p className="text-xs sm:text-sm text-starlight-muted max-w-xl leading-relaxed">
            Your real-life momentum projected across time. See the hero you are forging through daily consistency.
          </p>
        </div>
      </div>

      {/* Grid: Projections + Life DNA Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Projections & Milestones */}
        <div className="lg:col-span-2 space-y-6">
          {/* Future Self Projection Card */}
          <div className="p-6 glass-card rounded-2xl border border-gold/30 bg-gold/5 space-y-4">
            <div className="flex items-center gap-2 text-gold">
              <Sparkles className="w-5 h-5 text-gold" />
              <h2 className="font-title text-lg font-bold text-white">
                Future Self Projection Engine
              </h2>
            </div>
            <p className="text-xs text-starlight-muted leading-relaxed">
              Based on your consistency pace of <span className="font-semibold text-white">{completedCount} conquered quests</span> and an active streak of <span className="font-semibold text-amber-400">{streak} days</span>:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-midnight/80 border border-white/10">
                <div className="text-[10px] text-starlight-muted uppercase font-bold">Next Level ({currentLevel + 1})</div>
                <div className="font-mono text-xl font-bold text-gold mt-1">
                  ~{estimatedDaysToNextLevel} {estimatedDaysToNextLevel === 1 ? 'day' : 'days'}
                </div>
                <p className="text-[10px] text-starlight-muted mt-1">At current daily quest velocity</p>
              </div>

              <div className="p-4 rounded-xl bg-midnight/80 border border-white/10">
                <div className="text-[10px] text-starlight-muted uppercase font-bold">Grand Milestone (Level 10)</div>
                <div className="font-mono text-xl font-bold text-purple-300 mt-1">
                  {currentLevel >= 10 ? 'Achieved!' : `~${estimatedDaysToLevel10} days`}
                </div>
                <p className="text-[10px] text-starlight-muted mt-1">Unlocks Celestial Void Realm</p>
              </div>

              <div className="p-4 rounded-xl bg-midnight/80 border border-white/10">
                <div className="text-[10px] text-starlight-muted uppercase font-bold">Habit Momentum</div>
                <div className="font-mono text-xl font-bold text-emerald-400 mt-1">
                  {Math.min(100, Math.round((streak / 7) * 100))}% Peak
                </div>
                <p className="text-[10px] text-starlight-muted mt-1">Compounding daily power</p>
              </div>
            </div>
          </div>

          {/* DNA Attribute Spectrum */}
          <div className="p-6 glass-card rounded-2xl border border-white/10 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Dna className="w-5 h-5 text-purple-400" />
                <h3 className="font-title text-lg font-bold text-white">
                  Attribute Spectrum
                </h3>
              </div>
              <span className="badge-purple text-[10px]">{character?.dnaClass || 'Hero'}</span>
            </div>

            <div className="space-y-3">
              {attributes.map((attr) => (
                <div key={attr.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">{attr.name}</span>
                    <span className="font-mono font-bold text-gold">{attr.val}</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-midnight overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${attr.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (attr.val / maxAttr) * 100)}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Stats Breakdown */}
        <div className="space-y-6">
          <div className="p-6 glass-card rounded-2xl border border-white/10 space-y-4">
            <h3 className="font-title text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-gold" />
              <span>Conquest Metrics</span>
            </h3>

            <div className="space-y-3">
              {[
                { label: 'Lifetime XP', val: totalXp.toLocaleString() },
                { label: 'Completed Quests', val: completedCount },
                { label: 'Current Streak', val: `${streak} days` },
                { label: 'Max Historical Streak', val: `${character?.longestStreak || streak} days` },
                { label: 'Bosses Vanquished', val: character?.bossesDefeated || 0 },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 text-xs">
                  <span className="text-starlight-muted">{item.label}</span>
                  <span className="font-mono font-bold text-white">{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Trophy,
  Sparkles,
  Lock,
  CheckCircle2,
  Calendar,
  Award
} from 'lucide-react'
import { achievementService } from '../services/services'

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('ALL')

  const loadAchievements = useCallback(async () => {
    try {
      setLoading(true)
      const data = await achievementService.getAchievements()
      setAchievements(data || [])
    } catch (err) {
      console.error('Failed to load achievements:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAchievements()
  }, [loadAchievements])

  const unlockedCount = achievements.filter((a) => a.unlocked).length
  const totalCount = achievements.length || 10
  const completionPct = Math.round((unlockedCount / totalCount) * 100)

  const filtered = achievements.filter((a) => {
    if (activeTab === 'UNLOCKED') return a.unlocked
    if (activeTab === 'LOCKED') return !a.unlocked
    return true
  })

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 lg:p-8 glass-card rounded-3xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold">
            <Trophy className="w-3.5 h-3.5" />
            <span>Hall of Legends</span>
          </div>
          <h1 className="font-title text-3xl sm:text-4xl font-extrabold text-white">
            Trophies & Milestones
          </h1>
          <p className="text-xs sm:text-sm text-starlight-muted max-w-xl leading-relaxed">
            Permanent badges celebrating your consistency, grit, boss conquests, and mastery.
          </p>
        </div>

        {/* Progress Summary Card */}
        <div className="p-5 rounded-2xl bg-midnight/90 border border-gold/30 shadow-glow-gold flex items-center gap-4 min-w-[200px]">
          <div className="w-12 h-12 rounded-xl bg-gold/20 border border-gold/40 flex items-center justify-center text-gold">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-starlight-muted tracking-wider">Trophies Unlocked</div>
            <div className="font-mono text-2xl font-black text-gold">
              {unlockedCount} / {totalCount}
            </div>
            <div className="text-[10px] text-starlight-muted mt-0.5">{completionPct}% Complete</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {['ALL', 'UNLOCKED', 'LOCKED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
              activeTab === tab
                ? 'bg-gold text-midnight font-bold shadow-glow-gold'
                : 'glass-card text-starlight-muted hover:text-white border border-white/5'
            }`}
          >
            {tab.toLowerCase()}
          </button>
        ))}
      </div>

      {/* Achievement Badges Grid */}
      {loading ? (
        <div className="p-16 text-center text-starlight-muted">
          <Sparkles className="w-6 h-6 text-gold animate-spin mx-auto mb-2" />
          <p className="text-xs">Polishing heroic trophies...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-16 glass-card rounded-2xl border border-white/10 text-center text-starlight-muted">
          <Trophy className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-sm font-semibold">No trophies found matching filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((ach) => {
            const isUnlocked = ach.unlocked

            return (
              <motion.div
                key={ach.id}
                whileHover={isUnlocked ? { y: -3 } : {}}
                className={`p-6 glass-card rounded-2xl border transition-all flex items-start gap-4 ${
                  isUnlocked
                    ? 'border-gold/40 bg-gold/5 shadow-glow-gold'
                    : 'border-white/5 opacity-50 grayscale'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 ${
                    isUnlocked
                      ? 'bg-gradient-to-tr from-purple-rpg to-gold/30 border border-gold/40 shadow-md'
                      : 'bg-white/5 border border-white/10'
                  }`}
                >
                  {isUnlocked ? (
                    <span>{ach.icon || '🏆'}</span>
                  ) : (
                    <Lock className="w-6 h-6 text-starlight-muted" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className={`font-title text-sm font-bold truncate ${
                      isUnlocked ? 'text-white' : 'text-starlight-muted'
                    }`}>
                      {ach.name}
                    </h3>
                    {isUnlocked && (
                      <span className="badge-gold text-[10px]">Unlocked</span>
                    )}
                  </div>

                  <p className="text-xs text-starlight-muted leading-relaxed line-clamp-2">
                    {ach.description}
                  </p>

                  <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-purple-300">+{ach.xpBonus || 50} XP</span>
                    <span className="text-gold font-bold">+{ach.goldBonus || 25} Gold</span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

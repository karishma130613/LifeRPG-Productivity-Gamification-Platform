import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  User,
  Shield,
  Sword,
  Sparkles,
  Trophy,
  Coins,
  Flame,
  Dna,
  Zap,
  CheckCircle2,
  ChevronRight,
  Package
} from 'lucide-react'
import { useGame } from '../context/GameContext'
import { characterService, inventoryService, achievementService } from '../services/services'
import { XPBar, AttributeBar } from '../components/HUDComponents'
import LumiCompanion from '../components/LumiCompanion'

export default function CharacterPage() {
  const { character, updateCharacter } = useGame()
  const [inventory, setInventory] = useState([])
  const [achievements, setAchievements] = useState([])
  const [loading, setLoading] = useState(true)

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true)
      const [charData, invData, achData] = await Promise.allSettled([
        characterService.getCharacter(),
        inventoryService.getInventory(),
        achievementService.getAchievements(),
      ])

      if (charData.status === 'fulfilled') updateCharacter(charData.value)
      if (invData.status === 'fulfilled') setInventory(invData.value || [])
      if (achData.status === 'fulfilled') setAchievements(achData.value || [])
    } catch (err) {
      console.error('Failed to load profile:', err)
    } finally {
      setLoading(false)
    }
  }, [updateCharacter])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  const equippedItems = inventory.filter((item) => item.equipped)
  const unlockedAchievements = achievements.filter((a) => a.unlocked)

  const attributeList = [
    { name: 'Strength', key: 'strength', val: character?.strength || 10, color: 'from-red-500 to-rose-400', desc: 'Physical fitness, vigor, workouts' },
    { name: 'Intellect', key: 'intellect', val: character?.intellect || 10, color: 'from-blue-500 to-cyan-400', desc: 'Reading, learning, problem solving' },
    { name: 'Discipline', key: 'discipline', val: character?.discipline || 10, color: 'from-amber-500 to-yellow-400', desc: 'Focus, consistency, habit streaks' },
    { name: 'Creativity', key: 'creativity', val: character?.creativity || 10, color: 'from-purple-500 to-pink-400', desc: 'Design, writing, art, innovation' },
    { name: 'Vitality', key: 'vitality', val: character?.vitality || 10, color: 'from-emerald-500 to-teal-400', desc: 'Sleep, nutrition, wellness' },
    { name: 'Charisma', key: 'charisma', val: character?.charisma || 10, color: 'from-pink-500 to-rose-400', desc: 'Social connection, teamwork, speaking' },
  ]

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Header Card */}
      <div className="p-6 lg:p-8 glass-card rounded-3xl border border-white/10 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
          {/* Avatar Icon */}
          <div className="relative">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-purple-rpg via-purple-600 to-gold p-1 shadow-glow-gold flex items-center justify-center">
              <div className="w-full h-full rounded-3xl bg-midnight flex items-center justify-center font-title text-4xl sm:text-5xl font-black text-gold">
                {character?.username?.charAt(0)?.toUpperCase() || 'H'}
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-gold text-midnight font-bold text-xs shadow-md">
              Lvl {character?.level || 1}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <h1 className="font-title text-2xl sm:text-3xl font-bold text-white">
                {character?.username || 'Hero'}
              </h1>
              <span className="badge-purple self-center md:self-auto">
                {character?.dnaClass || 'Novice Seeker'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-starlight-muted">
              {character?.title || 'Wanderer of the Starlight Realm'}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-gold">
                <Coins className="w-4 h-4 text-gold" />
                <span>{character?.gold || 0} Gold</span>
              </span>
              <span className="text-white/20">•</span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{character?.currentStreak || 0} Days Streak</span>
              </span>
              <span className="text-white/20">•</span>
              <span className="flex items-center gap-1.5 text-starlight-blue">
                <Trophy className="w-4 h-4 text-starlight-blue" />
                <span>{unlockedAchievements.length} Achievements</span>
              </span>
            </div>

            {/* XP Bar */}
            <div className="pt-3 max-w-xl">
              <div className="flex items-center justify-between text-xs text-starlight-muted mb-1.5">
                <span>Progress to Level {(character?.level || 1) + 1}</span>
                <span className="font-mono text-gold">
                  {character?.currentXp || 0} / {character?.nextLevelXp || 100} XP
                </span>
              </div>
              <XPBar current={character?.currentXp || 0} max={character?.nextLevelXp || 100} />
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Life DNA Attributes + Equipment & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Life DNA Attributes */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 glass-card rounded-2xl border border-white/10 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Dna className="w-5 h-5 text-purple-400" />
                <h2 className="font-title text-xl font-bold text-white">Life DNA Breakdown</h2>
              </div>
              <span className="text-xs text-starlight-muted">Auto-tuned by quest completion</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {attributeList.map((attr) => (
                <div key={attr.key} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{attr.name}</span>
                    <span className="font-mono font-bold text-gold">{attr.val}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-midnight overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${attr.color}`}
                      style={{ width: `${Math.min(100, (attr.val / 100) * 100)}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-starlight-muted">{attr.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Equipped Inventory */}
          <div className="p-6 glass-card rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-gold" />
                <h2 className="font-title text-xl font-bold text-white">Equipped Gear</h2>
              </div>
              <Link to="/inventory" className="text-xs text-gold hover:text-amber-300 font-semibold flex items-center gap-1">
                <span>View Inventory</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {equippedItems.length === 0 ? (
              <div className="p-8 text-center text-starlight-muted border border-dashed border-white/10 rounded-xl">
                <p className="text-xs">No equipment or companions equipped currently.</p>
                <Link to="/shop" className="mt-2 inline-block text-xs font-bold text-gold">
                  Visit Celestial Bazaar →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {equippedItems.map((item) => (
                  <div key={item.id} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-gold">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{item.shopItem?.name || 'Artifact'}</div>
                      <div className="text-[10px] text-starlight-muted">{item.shopItem?.category || 'GEAR'}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Lifetime Statistics */}
        <div className="space-y-6">
          <div className="p-6 glass-card rounded-2xl border border-white/10 space-y-4">
            <h2 className="font-title text-lg font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-gold" />
              <span>Adventurer Record</span>
            </h2>

            <div className="space-y-3">
              {[
                { label: 'Total Quests Completed', val: character?.totalQuestsCompleted || 0 },
                { label: 'Total XP Gathered', val: character?.totalXp || 0 },
                { label: 'Best Streak', val: `${character?.longestStreak || 0} days` },
                { label: 'Bosses Vanquished', val: character?.bossesDefeated || 0 },
                { label: 'Current Level', val: `Level ${character?.level || 1}` },
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 text-xs">
                  <span className="text-starlight-muted">{stat.label}</span>
                  <span className="font-mono font-bold text-white">{stat.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Trophy Showcase */}
          <div className="p-6 glass-card rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-title text-base font-bold text-white">Recent Trophies</h3>
              <Link to="/achievements" className="text-xs text-gold hover:text-amber-300 font-semibold">
                All ({unlockedAchievements.length})
              </Link>
            </div>

            {unlockedAchievements.length === 0 ? (
              <p className="text-xs text-starlight-muted text-center py-4">
                No achievements unlocked yet. Keep questing to claim your first badge!
              </p>
            ) : (
              <div className="space-y-2">
                {unlockedAchievements.slice(0, 3).map((ach) => (
                  <div key={ach.id} className="p-3 rounded-xl bg-white/5 border border-gold/20 flex items-center gap-3">
                    <span className="text-xl">{ach.icon || '🏆'}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">{ach.name}</div>
                      <div className="text-[10px] text-starlight-muted truncate">{ach.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

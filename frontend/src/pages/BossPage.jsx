import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldAlert,
  Plus,
  Sparkles,
  Sword,
  Skull,
  Trophy,
  Heart,
  Calendar,
  X,
  Loader2
} from 'lucide-react'
import { bossService } from '../services/services'
import BossCard from '../components/BossCard'

export default function BossPage() {
  const [bosses, setBosses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showSummonModal, setShowSummonModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    title: 'The Great Hurdle',
    description: '',
    category: 'PRODUCTIVITY',
    maxHp: 200,
    xpReward: 300,
    goldReward: 150,
  })

  const loadBosses = useCallback(async () => {
    try {
      setLoading(true)
      const data = await bossService.getBosses()
      setBosses(data || [])
    } catch (err) {
      console.error('Failed to load bosses:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadBosses()
  }, [loadBosses])

  const handleSummon = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    try {
      setSubmitting(true)
      await bossService.createBoss({
        ...formData,
        currentHp: formData.maxHp,
      })
      setShowSummonModal(false)
      setFormData({
        name: '',
        title: 'The Great Hurdle',
        description: '',
        category: 'PRODUCTIVITY',
        maxHp: 200,
        xpReward: 300,
        goldReward: 150,
      })
      loadBosses()
    } catch (err) {
      console.error('Failed to summon boss:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const activeBosses = bosses.filter((b) => !b.isDefeated)
  const defeatedBosses = bosses.filter((b) => b.isDefeated)

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-title text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
            <ShieldAlert className="w-7 h-7 text-red-400" />
            <span>Boss Raids</span>
          </h1>
          <p className="text-xs sm:text-sm text-starlight-muted mt-1">
            Turn monolithic life challenges, exams, or major work projects into epic multi-day raid encounters
          </p>
        </div>

        <button
          onClick={() => setShowSummonModal(true)}
          className="btn-gold text-xs sm:text-sm font-bold flex items-center gap-2 shadow-glow-gold"
        >
          <Plus className="w-4 h-4" />
          <span>Summon Boss Challenge</span>
        </button>
      </div>

      {/* Active Bosses */}
      <div className="space-y-4">
        <h2 className="font-title text-lg font-bold text-white flex items-center gap-2">
          <Sword className="w-5 h-5 text-red-400" />
          <span>Active Raids ({activeBosses.length})</span>
        </h2>

        {loading ? (
          <div className="p-12 text-center text-starlight-muted">
            <Sparkles className="w-6 h-6 text-gold animate-spin mx-auto mb-2" />
            <p className="text-xs">Summoning raid encounters...</p>
          </div>
        ) : activeBosses.length === 0 ? (
          <div className="p-12 glass-card rounded-2xl border border-white/10 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-title text-lg font-bold text-white">No Active Bosses</h3>
              <p className="text-xs text-starlight-muted max-w-md mx-auto mt-1">
                Summon a boss representing a major hurdle (e.g. "Final Exams Colossus" or "Procrastination Dragon") to deal damage with every completed quest!
              </p>
            </div>
            <button
              onClick={() => setShowSummonModal(true)}
              className="btn-gold text-xs font-bold px-4 py-2"
            >
              Summon a Boss
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeBosses.map((boss) => (
              <BossCard key={boss.id} boss={boss} />
            ))}
          </div>
        )}
      </div>

      {/* Hall of Defeated Bosses */}
      {defeatedBosses.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-white/10">
          <h2 className="font-title text-lg font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-gold" />
            <span>Hall of Vanquished Foes ({defeatedBosses.length})</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {defeatedBosses.map((boss) => (
              <BossCard key={boss.id} boss={boss} />
            ))}
          </div>
        </div>
      )}

      {/* Summon Boss Modal */}
      <AnimatePresence>
        {showSummonModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg p-6 glass-card rounded-2xl border border-red-500/30 shadow-2xl relative"
            >
              <button
                onClick={() => setShowSummonModal(false)}
                className="absolute top-4 right-4 text-starlight-muted hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                  <Skull className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-title text-lg font-bold text-white">Summon Boss Monster</h3>
                  <p className="text-[11px] text-starlight-muted">Give your life hurdle a tangible monster form</p>
                </div>
              </div>

              <form onSubmit={handleSummon} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-starlight-muted uppercase mb-1">
                    Boss Monster Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. The Procrastination Behemoth"
                    className="input-field"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-starlight-muted uppercase mb-1">
                      Title / Epithet
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Scourge of Deadlines"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-starlight-muted uppercase mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="input-field"
                    >
                      <option value="PRODUCTIVITY">Productivity</option>
                      <option value="FITNESS">Fitness / Health</option>
                      <option value="CAREER">Career / Study</option>
                      <option value="DISCIPLINE">Habits / Discipline</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-starlight-muted uppercase mb-1">
                    Description & Stakes
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="What real-world achievement does defeating this boss represent?"
                    rows={2}
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-starlight-muted uppercase mb-1">
                      Total Boss HP
                    </label>
                    <input
                      type="number"
                      value={formData.maxHp}
                      onChange={(e) => setFormData({ ...formData, maxHp: parseInt(e.target.value) || 100 })}
                      min={50}
                      step={25}
                      className="input-field font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-starlight-muted uppercase mb-1">
                      XP Reward
                    </label>
                    <input
                      type="number"
                      value={formData.xpReward}
                      onChange={(e) => setFormData({ ...formData, xpReward: parseInt(e.target.value) || 100 })}
                      min={50}
                      className="input-field font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-starlight-muted uppercase mb-1">
                      Gold Reward
                    </label>
                    <input
                      type="number"
                      value={formData.goldReward}
                      onChange={(e) => setFormData({ ...formData, goldReward: parseInt(e.target.value) || 50 })}
                      min={25}
                      className="input-field font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowSummonModal(false)}
                    className="btn-ghost text-xs font-semibold px-4 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-gold text-xs font-bold px-5 py-2 shadow-glow-gold flex items-center gap-2"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Summon Boss'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Sword,
  Plus,
  Zap,
  Search,
  Filter,
  CheckCircle2,
  Flame,
  Calendar,
  Layers,
  Sparkles,
  AlertCircle
} from 'lucide-react'
import { useGame } from '../context/GameContext'
import { questService } from '../services/services'
import QuestCard from '../components/QuestCard'
import QuestFormModal from '../components/QuestFormModal'
import AiPlannerModal from '../components/AiPlannerModal'
import QuestGameArenaModal from '../components/QuestGameArenaModal'

export default function QuestsPage() {
  const {
    updateCharacter,
    triggerReward,
    triggerLevelUp,
    spawnFloatingXP,
    spawnFloatingGold,
  } = useGame()

  const [quests, setQuests] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ACTIVE') // 'ACTIVE', 'COMPLETED', 'ALL'
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [selectedQuestForEdit, setSelectedQuestForEdit] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showAiModal, setShowAiModal] = useState(false)
  const [activeQuestForTrial, setActiveQuestForTrial] = useState(null)

  const loadQuests = useCallback(async () => {
    try {
      setLoading(true)
      const data = await questService.getQuests()
      setQuests(data || [])
    } catch (err) {
      console.error('Failed to load quests:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadQuests()
  }, [loadQuests])

  const handleQuestComplete = (questOrId) => {
    if (typeof questOrId === 'object' && questOrId !== null) {
      setActiveQuestForTrial(questOrId)
    } else {
      const q = quests.find((item) => item.id === questOrId)
      if (q) setActiveQuestForTrial(q)
    }
  }

  const handleVictoryComplete = async (questId) => {
    try {
      const result = await questService.completeQuest(questId)

      if (result.updatedCharacter) {
        updateCharacter(result.updatedCharacter)
      }

      spawnFloatingXP(result.xpGained || 25)
      spawnFloatingGold(result.goldGained || 10)
      triggerReward(result)

      if (result.leveledUp) {
        triggerLevelUp(result)
      }

      loadQuests()
    } catch (err) {
      console.error('Failed to complete quest:', err)
    }
  }

  const handleDeleteQuest = async (questId) => {
    if (!window.confirm('Abandon this quest?')) return
    try {
      await questService.deleteQuest(questId)
      loadQuests()
    } catch (err) {
      console.error('Failed to delete quest:', err)
    }
  }

  const handleEditQuest = (quest) => {
    setSelectedQuestForEdit(quest)
    setShowCreateModal(true)
  }

  const filteredQuests = useMemo(() => {
    return quests.filter((q) => {
      // Status filter
      if (statusFilter === 'ACTIVE' && q.status === 'COMPLETED') return false
      if (statusFilter === 'COMPLETED' && q.status !== 'COMPLETED') return false

      // Category filter
      if (categoryFilter !== 'ALL' && q.category?.toUpperCase() !== categoryFilter) {
        return false
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchesTitle = q.title?.toLowerCase().includes(query)
        const matchesDesc = q.description?.toLowerCase().includes(query)
        if (!matchesTitle && !matchesDesc) return false
      }

      return true
    })
  }, [quests, statusFilter, categoryFilter, searchQuery])

  const categories = [
    'ALL',
    'FITNESS',
    'MIND',
    'CAREER',
    'HABIT',
    'CREATIVITY',
    'SOCIAL',
  ]

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-title text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
            <Sword className="w-7 h-7 text-gold" />
            <span>Quest Log</span>
          </h1>
          <p className="text-xs sm:text-sm text-starlight-muted mt-1">
            Conquer real-life tasks to harvest XP, gold, and attribute enhancements
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setShowAiModal(true)}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl glass-card border border-purple-500/40 text-purple-200 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 hover:bg-purple-500/20 transition-colors"
          >
            <Zap className="w-4 h-4 text-purple-400" />
            <span>AI Blueprint</span>
          </button>
          <button
            onClick={() => {
              setSelectedQuestForEdit(null)
              setShowCreateModal(true)
            }}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl btn-gold text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-glow-gold"
          >
            <Plus className="w-4 h-4" />
            <span>New Quest</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="p-4 glass-card rounded-2xl border border-white/10 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-2 p-1 bg-white/5 rounded-xl border border-white/5">
            {['ACTIVE', 'COMPLETED', 'ALL'].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  statusFilter === tab
                    ? 'bg-gold text-midnight shadow-glow-gold font-bold'
                    : 'text-starlight-muted hover:text-white'
                }`}
              >
                {tab.toLowerCase()}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-starlight-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search quest title or description..."
              className="input-field pl-10 py-2 text-xs"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-starlight-muted font-semibold flex items-center gap-1 pl-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Domain:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-purple-500/30 text-purple-200 border border-purple-500/50 font-bold'
                  : 'bg-white/5 text-starlight-muted hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Quests List */}
      {loading ? (
        <div className="p-12 text-center text-starlight-muted">
          <Sparkles className="w-6 h-6 text-gold animate-spin mx-auto mb-2" />
          <p className="text-xs">Gathering quests from the parchment...</p>
        </div>
      ) : filteredQuests.length === 0 ? (
        <div className="p-12 glass-card rounded-2xl border border-white/10 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-starlight-muted">
            <Sword className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-title text-lg font-bold text-white">No Quests Found</h3>
            <p className="text-xs text-starlight-muted max-w-sm mx-auto mt-1">
              No quests match your current search or filters. Adjust filters or forge a new quest.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedQuestForEdit(null)
              setShowCreateModal(true)
            }}
            className="btn-gold text-xs font-bold px-4 py-2"
          >
            Create a Quest
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredQuests.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              onComplete={handleQuestComplete}
              onEdit={handleEditQuest}
              onDelete={handleDeleteQuest}
              onUpdated={loadQuests}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Quest Modal */}
      {showCreateModal && (
        <QuestFormModal
          initialQuest={selectedQuestForEdit}
          onClose={() => {
            setShowCreateModal(false)
            setSelectedQuestForEdit(null)
          }}
          onSaved={() => {
            setShowCreateModal(false)
            setSelectedQuestForEdit(null)
            loadQuests()
          }}
        />
      )}

      {/* AI Planner Modal */}
      {showAiModal && (
        <AiPlannerModal
          onClose={() => setShowAiModal(false)}
          onPlanAccepted={() => {
            setShowAiModal(false)
            loadQuests()
          }}
        />
      )}

      {/* Quest Trial Game Arena Modal */}
      {activeQuestForTrial && (
        <QuestGameArenaModal
          quest={activeQuestForTrial}
          onClose={() => setActiveQuestForTrial(null)}
          onVictoryComplete={handleVictoryComplete}
        />
      )}
    </div>
  )
}

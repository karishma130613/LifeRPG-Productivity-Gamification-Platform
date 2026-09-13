import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Compass,
  Plus,
  Sparkles,
  MapPin,
  CheckCircle2,
  Lock,
  ArrowRight,
  Award,
  Layers,
  ChevronRight,
  X
} from 'lucide-react'
import { mainQuestService } from '../services/services'
import QuestMapView from '../components/QuestMapView'
import MainQuestModal from '../components/MainQuestModal'

export default function QuestMapPage() {
  const [mainQuests, setMainQuests] = useState([])
  const [selectedQuestId, setSelectedQuestId] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [loading, setLoading] = useState(true)

  const loadMainQuests = useCallback(async () => {
    try {
      setLoading(true)
      const data = await mainQuestService.getMainQuests()
      setMainQuests(data || [])
      if (data && data.length > 0 && !selectedQuestId) {
        setSelectedQuestId(data[0].id)
      }
    } catch (err) {
      console.error('Failed to load main quests:', err)
    } finally {
      setLoading(false)
    }
  }, [selectedQuestId])

  useEffect(() => {
    loadMainQuests()
  }, [loadMainQuests])

  const currentQuest = mainQuests.find((q) => q.id === selectedQuestId) || mainQuests[0]

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-title text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
            <Compass className="w-7 h-7 text-starlight-blue" />
            <span>Journey Map</span>
          </h1>
          <p className="text-xs sm:text-sm text-starlight-muted mt-1">
            Visual progression pathways for major life ambitions and multi-stage goals
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-gold text-xs sm:text-sm font-bold flex items-center gap-2 shadow-glow-gold"
        >
          <Plus className="w-4 h-4" />
          <span>Forge New Journey</span>
        </button>
      </div>

      {/* Main Quest Selector Tabs */}
      {mainQuests.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {mainQuests.map((mq) => {
            const completedCount = mq.nodes?.filter((n) => n.status === 'COMPLETED').length || 0
            const totalCount = mq.nodes?.length || 0
            const isSelected = mq.id === (currentQuest?.id)
            return (
              <button
                key={mq.id}
                onClick={() => {
                  setSelectedQuestId(mq.id)
                  setSelectedNode(null)
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-2.5 transition-all ${
                  isSelected
                    ? 'bg-purple-600/30 border border-purple-500/60 text-white shadow-glow-gold'
                    : 'glass-card border border-white/10 text-starlight-muted hover:text-white'
                }`}
              >
                <span>{mq.title}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 font-mono">
                  {completedCount}/{totalCount}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* Main Display Area */}
      {loading ? (
        <div className="p-16 text-center text-starlight-muted">
          <Sparkles className="w-6 h-6 text-gold animate-spin mx-auto mb-2" />
          <p className="text-xs">Tracing constellation paths...</p>
        </div>
      ) : !currentQuest ? (
        <div className="p-16 glass-card rounded-2xl border border-white/10 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-starlight-muted">
            <Compass className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-title text-xl font-bold text-white">No Journey Begun</h3>
            <p className="text-xs text-starlight-muted max-w-md mx-auto mt-1">
              Main Quests organize multi-week pursuits (learning a framework, training for a half-marathon, launching a product) into linear quest maps.
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-gold text-xs font-bold px-5 py-2.5 shadow-glow-gold"
          >
            Forge Your First Journey
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Current Journey Details Card */}
          <div className="p-6 glass-card rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="badge-purple text-[10px]">{currentQuest.category || 'EPIC JOURNEY'}</span>
                {currentQuest.completed && (
                  <span className="badge-gold text-[10px]">COMPLETED</span>
                )}
              </div>
              <h2 className="font-title text-xl font-bold text-white">
                {currentQuest.title}
              </h2>
              <p className="text-xs text-starlight-muted mt-1 max-w-2xl leading-relaxed">
                {currentQuest.description}
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-starlight-muted tracking-wider">Completion</div>
                <div className="font-mono text-base font-bold text-gold">
                  {Math.round(
                    ((currentQuest.nodes?.filter((n) => n.status === 'COMPLETED').length || 0) /
                      (currentQuest.nodes?.length || 1)) *
                      100
                  )}
                  %
                </div>
              </div>
            </div>
          </div>

          {/* SVG Journey Map Card */}
          <div className="p-6 glass-card rounded-2xl border border-white/10 relative overflow-hidden">
            <div className="text-xs text-starlight-muted mb-4 flex items-center justify-between">
              <span>Click on any active node to inspect requirements</span>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Completed</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" /> Available</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-gray-600 inline-block" /> Locked</span>
              </div>
            </div>

            <QuestMapView
              mainQuest={currentQuest}
              onNodeClick={(node) => setSelectedNode(node)}
            />
          </div>
        </div>
      )}

      {/* Node Detail Drawer / Modal */}
      <AnimatePresence>
        {selectedNode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md p-6 glass-card rounded-2xl border border-white/15 shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedNode(null)}
                className="absolute top-4 right-4 text-starlight-muted hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-3">
                <span className="badge-purple text-[10px]">Node #{selectedNode.stepOrder}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  selectedNode.status === 'COMPLETED'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-purple-500/20 text-purple-300'
                }`}>
                  {selectedNode.status}
                </span>
              </div>

              <h3 className="font-title text-xl font-bold text-white mb-2">
                {selectedNode.nodeName}
              </h3>
              <p className="text-xs text-starlight-muted leading-relaxed mb-6">
                {selectedNode.description || 'Step forward to conquer this milestone in your journey.'}
              </p>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs mb-4">
                <span className="text-starlight-muted">Step {selectedNode.stepOrder} of your journey</span>
                <span className={`font-bold px-2 py-0.5 rounded-full ${
                  selectedNode.status === 'COMPLETED'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-purple-500/20 text-purple-300'
                }`}>
                  {selectedNode.status}
                </span>
              </div>

              {selectedNode.status === 'AVAILABLE' && (
                <p className="text-xs text-gold/80 bg-gold/5 border border-gold/20 rounded-xl p-3 mb-4">
                  ⚔️ Complete the matching quest in your <strong>Quests</strong> page to earn XP &amp; Gold rewards and unlock the next node.
                </p>
              )}

              <button
                onClick={() => setSelectedNode(null)}
                className="w-full py-2.5 rounded-xl btn-primary text-xs font-bold"
              >
                Close Node
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Main Quest Modal */}
      {showCreateModal && (
        <MainQuestModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false)
            loadMainQuests()
          }}
        />
      )}
    </div>
  )
}

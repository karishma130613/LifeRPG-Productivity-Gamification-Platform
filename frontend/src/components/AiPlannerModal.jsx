import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Sparkles, ChevronDown } from 'lucide-react'
import { aiService, mainQuestService } from '../services/services'

const CATEGORIES = ['Study','Coding','Career','Fitness','Reading','Creativity','Personal','Other']

export default function AiPlannerModal({ onClose, onSaved, onPlanAccepted }) {
  const [prompt, setPrompt]       = useState('')
  const [category, setCategory]   = useState('Coding')
  const [plan, setPlan]           = useState(null)
  const [loading, setLoading]     = useState(false)
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState('')

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (!prompt.trim()) return
    setLoading(true); setError(''); setPlan(null)
    try {
      const result = await aiService.generatePlan({ goalPrompt: prompt, targetCategory: category })
      setPlan(result)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate plan. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async () => {
    if (!plan) return
    setSaving(true); setError('')
    try {
      const nodeNames = plan.generatedQuests?.map(q => q.title) || []
      const saved = await mainQuestService.createMainQuest({
        title: plan.mainGoalTitle,
        description: plan.description,
        category: plan.category || category,
        nodes: nodeNames,
      })
      if (onSaved) onSaved(saved)
      if (onPlanAccepted) onPlanAccepted(saved)
      onClose()
    } catch (err) {
      console.error('Error saving plan:', err)
      setError(err.response?.data?.message || err.message || 'Failed to save plan')
    } finally {
      setSaving(false)
    }
  }

  const diffColors = { EASY: 'badge-easy', MEDIUM: 'badge-medium', HARD: 'badge-hard', LEGENDARY: 'badge-legendary' }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <motion.div className="modal-content max-w-2xl" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-display text-xl font-bold text-starlight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-lavender" />
            Quest Planner
          </h2>
          <button onClick={onClose} className="btn-icon text-starlight-dim"><X className="w-5 h-5" /></button>
        </div>
        <p className="text-xs text-starlight-dim mb-5">Generate a structured quest blueprint from your real-life goal.</p>

        {!plan ? (
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="label-field" htmlFor="ai-prompt">What do you want to achieve?</label>
              <input
                id="ai-prompt"
                className="input-field"
                placeholder="e.g. I want to learn Python from scratch and build a web app"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label-field" htmlFor="ai-cat">Primary Category</label>
              <div className="relative">
                <select id="ai-cat" className="select-field pr-8" value={category} onChange={e => setCategory(e.target.value)}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown className="absolute right-2.5 top-3.5 w-4 h-4 text-starlight-dim pointer-events-none" />
              </div>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
              <button type="submit" disabled={loading} className="btn-primary flex-1">
                {loading ? 'Planning...' : 'Generate Quest Blueprint ✨'}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="glass-card rounded-xl p-4 border border-purple-glow/20">
              <h3 className="font-display font-bold text-lavender mb-1">{plan.mainGoalTitle}</h3>
              <p className="text-xs text-starlight-dim">{plan.description}</p>
              {!plan.isAiGenerated && (
                <p className="text-xs text-gold/70 mt-2 italic">📋 Generated using structured template planner</p>
              )}
            </div>

            {/* Quest steps */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {plan.generatedQuests?.map((q, i) => (
                <motion.div
                  key={i}
                  className="glass-card rounded-xl px-4 py-3 flex items-center gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <span className="text-xs text-lavender font-bold w-5 flex-shrink-0">{i+1}.</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-starlight font-medium">{q.title}</p>
                    <p className="text-xs text-starlight-dim">{q.description}</p>
                  </div>
                  <span className={diffColors[q.difficulty] || 'badge-medium'}>{q.difficulty}</span>
                  <span className="text-xs text-purple-glow font-medium">{q.xpReward} XP</span>
                </motion.div>
              ))}
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <div className="flex gap-3">
              <button onClick={() => setPlan(null)} className="btn-ghost flex-1">← Edit</button>
              <button onClick={handleAccept} disabled={saving} className="btn-primary flex-1">
                {saving ? 'Saving...' : 'Accept & Create Quest Map 🗺️'}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

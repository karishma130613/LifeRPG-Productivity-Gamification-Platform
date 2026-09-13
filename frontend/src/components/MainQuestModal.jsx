import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Sparkles, ChevronDown } from 'lucide-react'
import { mainQuestService } from '../services/services'

const CATEGORIES = ['Study','Coding','Career','Fitness','Reading','Creativity','Personal','Other']

export default function MainQuestModal({ onClose, onSaved }) {
  const [title, setTitle]       = useState('')
  const [description, setDesc] = useState('')
  const [category, setCat]     = useState('Study')
  const [nodeInput, setNode]   = useState('')
  const [nodes, setNodes]      = useState([])
  const [loading, setLoading]  = useState(false)
  const [error, setError]      = useState('')

  const addNode = () => {
    if (nodeInput.trim()) {
      setNodes(prev => [...prev, nodeInput.trim()])
      setNode('')
    }
  }
  const removeNode = (i) => setNodes(prev => prev.filter((_, idx) => idx !== i))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) { setError('Main quest title is required'); return }
    if (nodes.length < 1) { setError('Add at least one quest step'); return }
    setLoading(true); setError('')
    try {
      const saved = await mainQuestService.createMainQuest({ title, description, category, nodes })
      onSaved(saved)
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to create main quest'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <motion.div className="modal-content" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-bold text-starlight">🗺️ Create Main Quest</h2>
          <button onClick={onClose} className="btn-icon text-starlight-dim" aria-label="Close"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-field" htmlFor="mq-title">Goal Title *</label>
            <input id="mq-title" className="input-field" placeholder="e.g. Become Internship Ready" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div>
            <label className="label-field" htmlFor="mq-desc">Description</label>
            <textarea id="mq-desc" className="input-field resize-none" rows={2} placeholder="Describe your big goal..." value={description} onChange={e => setDesc(e.target.value)} />
          </div>
          <div>
            <label className="label-field" htmlFor="mq-cat">Category</label>
            <div className="relative">
              <select id="mq-cat" className="select-field pr-8" value={category} onChange={e => setCat(e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-3.5 w-4 h-4 text-starlight-dim pointer-events-none" />
            </div>
          </div>

          {/* Quest Steps */}
          <div>
            <label className="label-field">Quest Steps (in order) *</label>
            <div className="flex gap-2 mb-2">
              <input
                className="input-field flex-1"
                placeholder="e.g. Learn Java Basics"
                value={nodeInput}
                onChange={e => setNode(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addNode())}
              />
              <button type="button" onClick={addNode} className="btn-primary px-4 py-2.5 text-sm">Add</button>
            </div>
            {nodes.length > 0 && (
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {nodes.map((n, i) => (
                  <div key={i} className="flex items-center gap-2 glass-card rounded-lg px-3 py-2">
                    <span className="text-xs text-lavender font-bold w-5">{i + 1}.</span>
                    <span className="flex-1 text-sm text-starlight">{n}</span>
                    <button type="button" onClick={() => removeNode(i)} className="text-red-400 hover:text-red-300 text-xs">✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}

          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Creating...' : 'Create Main Quest 🗺️'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, ChevronDown, Tag } from 'lucide-react'
import { questService } from '../services/services'

const CATEGORIES = ['Study','Coding','Career','Fitness','Reading','Creativity','Personal','Other']
const DIFFICULTIES = ['EASY','MEDIUM','HARD','LEGENDARY']
const PRIORITIES    = ['LOW','MEDIUM','HIGH']
const TRIAL_GAMES   = [
  { id: '', label: '✨ Auto (Matched to Category)' },
  { id: 'RHYTHM_SLASH', label: '⚔️ Starlight Blade (Slash)' },
  { id: 'RUNE_MEMORY', label: '🧠 Astral Rune Memory' },
  { id: 'SPELL_TYPER', label: '⚡ Spell Incantation Typer' },
  { id: 'ORB_DODGE', label: '🛡️ Celestial Star Catcher' },
  { id: 'CONSTELLATION_AIM', label: '🎯 Constellation Archer' },
]

export default function QuestFormModal({ onClose, onSaved, editQuest = null }) {
  const [form, setForm] = useState({
    title:       editQuest?.title || '',
    description: editQuest?.description || '',
    category:    editQuest?.category || 'Study',
    difficulty:  editQuest?.difficulty || 'MEDIUM',
    priority:    editQuest?.priority || 'MEDIUM',
    gameType:    editQuest?.gameType || '',
    dueDate:     editQuest?.dueDate || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) { setError('Quest title is required'); return }
    setLoading(true); setError('')
    try {
      const payload = {
        ...form,
        dueDate: form.dueDate ? form.dueDate : null,
      }
      let saved
      if (editQuest) {
        saved = await questService.updateQuest(editQuest.id, payload)
      } else {
        saved = await questService.createQuest(payload)
      }
      onSaved(saved)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save quest. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const difficultyColors = { EASY: 'text-emerald-400', MEDIUM: 'text-gold', HARD: 'text-orange-400', LEGENDARY: 'text-lavender' }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <motion.div
        className="modal-content"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-bold text-starlight">
            {editQuest ? '✏️ Edit Quest' : '⚔️ New Quest'}
          </h2>
          <button onClick={onClose} className="btn-icon text-starlight-dim hover:text-starlight" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="label-field" htmlFor="quest-title">Quest Title *</label>
            <input
              id="quest-title"
              className="input-field"
              placeholder="e.g. Complete Java assignment"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="label-field" htmlFor="quest-desc">Description</label>
            <textarea
              id="quest-desc"
              className="input-field resize-none"
              rows={2}
              placeholder="Optional quest details..."
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
          </div>

          {/* Category + Difficulty */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-field" htmlFor="quest-cat">Category</label>
              <div className="relative">
                <select id="quest-cat" className="select-field pr-8" value={form.category} onChange={e => set('category', e.target.value)}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown className="absolute right-2.5 top-3.5 w-4 h-4 text-starlight-dim pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="label-field" htmlFor="quest-diff">Difficulty</label>
              <div className="relative">
                <select id="quest-diff" className={`select-field pr-8 ${difficultyColors[form.difficulty]}`} value={form.difficulty} onChange={e => set('difficulty', e.target.value)}>
                  {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <ChevronDown className="absolute right-2.5 top-3.5 w-4 h-4 text-starlight-dim pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Priority + Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-field" htmlFor="quest-prio">Priority</label>
              <div className="relative">
                <select id="quest-prio" className="select-field pr-8" value={form.priority} onChange={e => set('priority', e.target.value)}>
                  {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <ChevronDown className="absolute right-2.5 top-3.5 w-4 h-4 text-starlight-dim pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="label-field" htmlFor="quest-due">Due Date</label>
              <input id="quest-due" type="date" className="input-field" value={form.dueDate} onChange={e => set('dueDate', e.target.value)} />
            </div>
          </div>

          {/* Trial Mini-Game */}
          <div>
            <label className="label-field" htmlFor="quest-gametype">Quest Completion Trial Game</label>
            <div className="relative">
              <select
                id="quest-gametype"
                className="select-field pr-8 text-gold font-medium"
                value={form.gameType}
                onChange={e => set('gameType', e.target.value)}
              >
                {TRIAL_GAMES.map(g => (
                  <option key={g.id} value={g.id} className="text-white bg-midnight">
                    {g.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-3.5 w-4 h-4 text-starlight-dim pointer-events-none" />
            </div>
            <p className="text-[11px] text-starlight-dim mt-1">
              Players must win this mini-game trial to claim the quest's XP &amp; gold!
            </p>
          </div>

          {/* Reward preview (server computed) */}
          <div className="glass-card rounded-xl p-3 border border-white/5">
            <p className="text-xs text-starlight-dim mb-1 flex items-center gap-1"><Tag className="w-3 h-3" /> Estimated Rewards (Server Calculated)</p>
            <div className="flex gap-4 text-sm">
              <span className="text-purple-glow font-semibold">
                {form.difficulty === 'EASY' ? '30' : form.difficulty === 'MEDIUM' ? '75' : form.difficulty === 'HARD' ? '200' : '500'} XP
              </span>
              <span className="text-gold font-semibold">
                {form.difficulty === 'EASY' ? '15' : form.difficulty === 'MEDIUM' ? '35' : form.difficulty === 'HARD' ? '90' : '250'} Gold
              </span>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Saving...' : editQuest ? 'Update Quest' : 'Create Quest ⚔️'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

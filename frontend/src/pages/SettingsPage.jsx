import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Settings,
  User,
  Shield,
  LogOut,
  Sparkles,
  Volume2,
  Sliders,
  Check,
  Info
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useGame } from '../context/GameContext'

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const { character } = useGame()
  const navigate = useNavigate()

  const [soundEnabled, setSoundEnabled] = useState(true)
  const [particlesEnabled, setParticlesEnabled] = useState(true)
  const [saved, setSaved] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-title text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
          <Settings className="w-7 h-7 text-gold" />
          <span>Realm Settings</span>
        </h1>
        <p className="text-xs sm:text-sm text-starlight-muted mt-1">
          Configure your adventurer preferences, display options, and security credentials
        </p>
      </div>

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm flex items-center gap-2"
        >
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Preferences saved successfully to local storage!</span>
        </motion.div>
      )}

      {/* Account Info Section */}
      <div className="p-6 glass-card rounded-2xl border border-white/10 space-y-4">
        <h2 className="font-title text-lg font-bold text-white flex items-center gap-2">
          <User className="w-5 h-5 text-purple-400" />
          <span>Hero Credentials</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-starlight-muted font-semibold uppercase">Hero Name</span>
            <div className="font-mono text-sm font-bold text-white">
              {character?.username || user?.username || 'Hero'}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-starlight-muted font-semibold uppercase">Scroll of Contact (Email)</span>
            <div className="font-mono text-sm font-bold text-white">
              {user?.email || 'hero@realm.com'}
            </div>
          </div>
        </div>
      </div>

      {/* Preferences Section */}
      <form onSubmit={handleSave} className="p-6 glass-card rounded-2xl border border-white/10 space-y-6">
        <h2 className="font-title text-lg font-bold text-white flex items-center gap-2">
          <Sliders className="w-5 h-5 text-gold" />
          <span>Sensory & Visual Preferences</span>
        </h2>

        <div className="space-y-4 text-sm">
          <label className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 cursor-pointer">
            <div>
              <div className="font-semibold text-white">Starlight Starfield Ambient Canvas</div>
              <div className="text-xs text-starlight-muted mt-0.5">
                Dynamic animated stars, twinkling dust, and mountain silhouettes
              </div>
            </div>
            <input
              type="checkbox"
              checked={particlesEnabled}
              onChange={(e) => setParticlesEnabled(e.target.checked)}
              className="w-5 h-5 accent-gold cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 cursor-pointer">
            <div>
              <div className="font-semibold text-white">RPG Sound Effects</div>
              <div className="text-xs text-starlight-muted mt-0.5">
                Audio cues for quest completion, gold chimes, and level up fanfares
              </div>
            </div>
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="w-5 h-5 accent-gold cursor-pointer"
            />
          </label>
        </div>

        <button
          type="submit"
          className="btn-gold text-xs font-bold px-5 py-2.5 shadow-glow-gold"
        >
          Save Preferences
        </button>
      </form>

      {/* About & Version info */}
      <div className="p-6 glass-card rounded-2xl border border-white/10 flex items-start gap-4">
        <Info className="w-6 h-6 text-starlight-muted flex-shrink-0 mt-0.5" />
        <div className="text-xs text-starlight-muted space-y-1">
          <div className="font-semibold text-white">Life RPG • Version 1.0.0 (Production Release)</div>
          <p>
            Full-stack gamified life management platform powered by Spring Boot, React, Vite,
            Tailwind CSS, and Starlight Adventure design system.
          </p>
        </div>
      </div>

      {/* Danger Zone: Log out */}
      <div className="p-6 glass-card rounded-2xl border border-red-500/20 flex items-center justify-between gap-4">
        <div>
          <div className="font-title text-sm font-bold text-white">Depart the Starlight Realm</div>
          <div className="text-xs text-starlight-muted mt-0.5">Safely close your session on this device</div>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold hover:bg-red-500/30 transition-colors flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  )
}

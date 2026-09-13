import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, KeyRound, User, ArrowRight, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import StarlightBackground from '../components/StarlightBackground'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!username.trim() || !password) {
      setError('Please enter both username and password.')
      return
    }

    try {
      setLoading(true)
      await login({
        username: username.trim(),
        usernameOrEmail: username.trim(),
        password,
      })
      navigate('/dashboard')
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Authentication failed. Please check your credentials.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-midnight flex items-center justify-center p-4 overflow-hidden">
      <StarlightBackground />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md p-8 glass-card rounded-2xl border border-white/15 shadow-2xl backdrop-blur-xl"
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-rpg to-gold flex items-center justify-center shadow-glow-gold group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-midnight" />
            </div>
            <span className="font-title text-2xl font-bold tracking-wider text-white">
              LIFE <span className="text-gold">RPG</span>
            </span>
          </Link>
          <h1 className="font-title text-2xl font-bold text-white">
            Resume Your Quest
          </h1>
          <p className="text-xs text-starlight-muted mt-1">
            Enter your credentials to return to the Starlight Realm
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-sm flex items-start gap-2.5"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Demo Account Quick Access */}
        <div className="mb-5 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-starlight-muted flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-white font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              Demo Hero Account
            </span>
            <button
              type="button"
              onClick={() => {
                setUsername('hero')
                setPassword('password123')
              }}
              className="text-[11px] font-bold text-gold hover:text-amber-300 underline underline-offset-2 transition-colors cursor-pointer"
            >
              Fill Credentials
            </button>
          </div>
          <div className="text-[11px] text-starlight-muted/80 flex items-center gap-3">
            <span>User: <strong className="text-white">hero</strong></span>
            <span>Pass: <strong className="text-white">password123</strong></span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-starlight-muted mb-2">
              Username or Email
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-starlight-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. starlight_hero"
                className="input-field pl-11"
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-starlight-muted mb-2">
              Secret Passphrase
            </label>
            <div className="relative">
              <KeyRound className="w-5 h-5 text-starlight-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="input-field pl-11"
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl btn-gold font-bold flex items-center justify-center gap-2 shadow-glow-gold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Enter Realm</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center text-sm text-starlight-muted">
          New adventurer?{' '}
          <Link
            to="/register"
            className="font-semibold text-gold hover:text-amber-300 transition-colors"
          >
            Create your hero account
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Mail, KeyRound, User, ArrowRight, AlertCircle, Loader2, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import StarlightBackground from '../components/StarlightBackground'

export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!username.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields.')
      return
    }

    if (username.trim().length < 3) {
      setError('Hero name must be at least 3 characters.')
      return
    }

    if (password.length < 6) {
      setError('Passphrase must be at least 6 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passphrases do not match.')
      return
    }

    try {
      setLoading(true)
      await register({
        username: username.trim(),
        email: email.trim(),
        password,
      })
      navigate('/dashboard')
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Registration failed. Username or email may already be registered.'
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
            Forge Your Hero
          </h1>
          <p className="text-xs text-starlight-muted mt-1">
            Create your account to unlock your Starlight destiny
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-starlight-muted mb-2">
              Hero Name
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-starlight-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. AstralKnight"
                className="input-field pl-11"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-starlight-muted mb-2">
              Scroll of Contact (Email)
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-starlight-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="adventurer@realm.com"
                className="input-field pl-11"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-starlight-muted mb-2">
              Passphrase
            </label>
            <div className="relative">
              <KeyRound className="w-5 h-5 text-starlight-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="input-field pl-11"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-starlight-muted mb-2">
              Confirm Passphrase
            </label>
            <div className="relative">
              <ShieldCheck className="w-5 h-5 text-starlight-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat passphrase"
                className="input-field pl-11"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-xl btn-gold font-bold flex items-center justify-center gap-2 shadow-glow-gold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Begin Your Journey</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-white/10 text-center text-sm text-starlight-muted">
          Already forged an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-gold hover:text-amber-300 transition-colors"
          >
            Log in to continue
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

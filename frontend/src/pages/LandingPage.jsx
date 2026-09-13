import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Sparkles,
  Sword,
  Shield,
  Compass,
  Trophy,
  Brain,
  Zap,
  ArrowRight,
  Flame,
  CheckCircle2,
  ChevronRight,
  Target
} from 'lucide-react'
import StarlightBackground from '../components/StarlightBackground'
import LumiCompanion from '../components/LumiCompanion'

export default function LandingPage() {
  const features = [
    {
      icon: Sword,
      title: 'Quests & Progression',
      desc: 'Transform daily habits, workouts, and work into epic RPG quests. Earn real XP and level up in life.',
      color: 'text-gold',
      border: 'border-gold/30',
    },
    {
      icon: Shield,
      title: 'Boss Battles',
      desc: 'Link massive life challenges—exams, big projects, fitness milestones—to Boss HP and defeat them quest by quest.',
      color: 'text-red-400',
      border: 'border-red-500/30',
    },
    {
      icon: Compass,
      title: 'Starlight Realm',
      desc: 'As you grow, illuminate regions across the World Map from the Whispering Woods to the Celestial Peak.',
      color: 'text-starlight-blue',
      border: 'border-starlight-blue/30',
    },
    {
      icon: Brain,
      title: 'Life DNA & Class',
      desc: 'Your attributes (Strength, Intellect, Discipline, Creativity, Vitality, Charisma) dynamically shape your RPG class.',
      color: 'text-purple-400',
      border: 'border-purple-500/30',
    },
    {
      icon: Zap,
      title: 'AI Quest Planner',
      desc: 'Turn any ambiguous dream into a structured, step-by-step quest blueprint with rewards and milestones.',
      color: 'text-amber-400',
      border: 'border-amber-500/30',
    },
    {
      icon: Trophy,
      title: 'Celestial Bazaar',
      desc: 'Spend your hard-earned gold on epic titles, companion skins, badge flairs, and consumable boosters.',
      color: 'text-emerald-400',
      border: 'border-emerald-500/30',
    },
  ]

  const steps = [
    {
      step: '01',
      title: 'Declare Your Quests',
      desc: 'Log your daily habits, study sessions, workouts, and long-term ambitions.',
    },
    {
      step: '02',
      title: 'Conquer & Earn XP',
      desc: 'Complete tasks to gain XP, unlock attributes, collect Gold, and keep your streak fiery.',
    },
    {
      step: '03',
      title: 'Slay Procrastination Bosses',
      desc: 'Deal massive damage to towering life hurdles with each milestone you conquer.',
    },
    {
      step: '04',
      title: 'Illuminate Your World',
      desc: 'Watch your Starlight World unlock new realms as your real-life stats flourish.',
    },
  ]

  return (
    <div className="relative min-h-screen bg-midnight text-starlight overflow-hidden">
      <StarlightBackground />

      {/* Navigation Header */}
      <header className="relative z-20 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-rpg to-gold flex items-center justify-center shadow-glow-gold">
            <Sparkles className="w-5 h-5 text-midnight" />
          </div>
          <span className="font-title text-2xl font-bold tracking-wider text-white">
            LIFE <span className="text-gold">RPG</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-semibold text-starlight hover:text-white transition-colors"
          >
            Log In
          </Link>
          <Link
            to="/register"
            className="btn-gold text-sm font-bold flex items-center gap-2"
          >
            <span>Begin Journey</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-rpg/30 border border-purple-500/40 text-starlight-light text-xs font-semibold mb-6 backdrop-blur-md"
        >
          <Sparkles className="w-3.5 h-3.5 text-gold animate-spin-slow" />
          <span>Don't just track your life. Play it.</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-title text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto"
        >
          Your Real-Life Progress <br />
          <span className="bg-gradient-to-r from-gold via-amber-200 to-starlight-blue bg-clip-text text-transparent drop-shadow">
            Lights Up Your World
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-starlight-muted max-w-2xl mx-auto leading-relaxed"
        >
          Turn daily habits, fitness routines, and major career milestones into an
          immersive fantasy role-playing adventure. Defeat procrastination bosses,
          unlock uncharted realms, and forge your true Life DNA.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-gold via-amber-400 to-amber-500 text-midnight font-bold text-lg flex items-center justify-center gap-3 shadow-glow-gold hover:scale-105 active:scale-95 transition-transform"
          >
            <Sparkles className="w-5 h-5 text-midnight" />
            <span>Create Your Hero</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-xl glass-card text-white font-semibold text-lg flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
          >
            <span>Resume Adventure</span>
          </Link>
        </motion.div>

        {/* Floating Companion Spotlight */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 relative mx-auto max-w-md p-6 glass-card rounded-2xl border border-white/10 flex items-center gap-5 text-left"
        >
          <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center">
            <LumiCompanion state="excited" message="" hideBubble={true} size="md" />
          </div>
          <div>
            <div className="text-xs font-bold text-gold uppercase tracking-wider mb-1">
              Meet Lumi • Your Guardian Spirit
            </div>
            <p className="text-sm text-starlight-light leading-relaxed">
              "Every quest you conquer in reality brings light to our world! Let's embark on today's journey together!"
            </p>
          </div>
        </motion.div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="font-title text-3xl sm:text-4xl font-bold text-white">
            Engineered for <span className="text-gold">Epic Transformation</span>
          </h2>
          <p className="mt-3 text-starlight-muted max-w-xl mx-auto">
            Not just another todo list. A complete RPG progression engine designed to ignite intrinsic motivation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                className={`p-6 rounded-2xl glass-card border ${feat.border} flex flex-col justify-between transition-all`}
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center ${feat.color} mb-5 shadow-lg`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-title text-xl font-bold text-white mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-starlight-muted leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* How it Works */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20 border-t border-white/10">
        <div className="text-center mb-16">
          <h2 className="font-title text-3xl sm:text-4xl font-bold text-white">
            The <span className="text-gold">Hero's Loop</span>
          </h2>
          <p className="mt-3 text-starlight-muted">
            Simple real-life actions compound into unstoppable fantasy power.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => (
            <div key={idx} className="p-6 rounded-2xl glass-card border border-white/5 relative">
              <span className="font-mono text-3xl font-black text-purple-400/40 absolute top-4 right-4">
                {s.step}
              </span>
              <h4 className="font-title text-lg font-bold text-white mt-4 mb-2">
                {s.title}
              </h4>
              <p className="text-xs text-starlight-muted leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Footer Banner */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-br from-purple-900/50 via-navy to-midnight border border-gold/40 shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="font-title text-3xl sm:text-5xl font-extrabold text-white">
              Ready to Level Up Your Reality?
            </h2>
            <p className="mt-4 text-starlight-muted max-w-xl mx-auto">
              Join thousands of adventurers conquering their goals, crushing procrastination, and lighting up the realm.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                to="/register"
                className="px-8 py-4 rounded-xl btn-gold text-lg font-bold flex items-center gap-3 shadow-glow-gold hover:scale-105 transition-transform"
              >
                <span>Begin Your Journey Today</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8 text-center text-xs text-starlight-muted">
        <p>© 2026 Life RPG. All rights reserved. Play your life with passion and purpose.</p>
      </footer>
    </div>
  )
}

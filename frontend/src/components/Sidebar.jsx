import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Swords, Gamepad2, Map, User, Globe, Trophy, ShoppingBag,
  Package, BarChart3, Settings, LogOut, Sparkles, Shield
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useGame } from '../context/GameContext'
import { useTheme } from '../context/ThemeContext'
import LumiCompanion from './LumiCompanion'
import { GoldCounter, StreakCounter } from './HUDComponents'

const navLinks = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard'     },
  { to: '/quests',       icon: Swords,          label: 'Quests'        },
  { to: '/game-realm',   icon: Gamepad2,        label: 'Game Realm 🎮' },
  { to: '/quest-map',   icon: Map,             label: 'Quest Map'     },
  { to: '/character',   icon: User,            label: 'Character'     },
  { to: '/world',       icon: Globe,           label: 'Life World'    },
  { to: '/boss',        icon: Shield,          label: 'Boss Battles'  },
  { to: '/achievements',icon: Trophy,          label: 'Achievements'  },
  { to: '/shop',        icon: ShoppingBag,     label: 'Shop'          },
  { to: '/inventory',   icon: Package,         label: 'Inventory'     },
  { to: '/progress',    icon: BarChart3,       label: 'Progress'      },
  { to: '/settings',    icon: Settings,        label: 'Settings'      },
]

// Realistic SVG Sun and Moon icons
function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="5" fill="#FCD34D" stroke="#F59E0B" strokeWidth="0.5"/>
      {/* Rays */}
      {[0,45,90,135,180,225,270,315].map((deg, i) => (
        <line
          key={i}
          x1={12 + 7 * Math.cos((deg * Math.PI) / 180)}
          y1={12 + 7 * Math.sin((deg * Math.PI) / 180)}
          x2={12 + 9.5 * Math.cos((deg * Math.PI) / 180)}
          y2={12 + 9.5 * Math.sin((deg * Math.PI) / 180)}
          stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round"
        />
      ))}
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Crescent moon shape */}
      <path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        fill="#E2D9F3"
        stroke="#C4B5F0"
        strokeWidth="0.5"
      />
      {/* Small craters for realism */}
      <circle cx="13" cy="9" r="1" fill="rgba(150,130,200,0.35)" />
      <circle cx="16" cy="13" r="0.7" fill="rgba(150,130,200,0.30)" />
      <circle cx="11" cy="14" r="0.8" fill="rgba(150,130,200,0.28)" />
    </svg>
  )
}

export default function Sidebar() {
  const { logout, user } = useAuth()
  const { character } = useGame()
  const { isDay, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <aside
      className="hidden lg:flex flex-col w-64 min-h-screen backdrop-blur border-r border-white/10 relative z-10"
      style={{ backgroundColor: 'var(--theme-sidebar-bg)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-glow to-lavender flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 className="font-display font-bold text-sm leading-tight" style={{ color: 'var(--theme-text)' }}>LIFE RPG</h1>
          <p className="text-xs" style={{ color: 'var(--theme-text-muted)' }}>Play your life</p>
        </div>

        {/* Day / Night Toggle */}
        <button
          onClick={toggleTheme}
          title={isDay ? 'Switch to Night' : 'Switch to Day'}
          className="ml-auto relative w-14 h-7 rounded-full border transition-all duration-500 flex items-center overflow-hidden shadow-inner flex-shrink-0"
          style={{
            background: isDay
              ? 'linear-gradient(135deg, #3a7fc0, #7bb8d8)'
              : 'linear-gradient(135deg, #0a0e1a, #1a1040)',
            borderColor: isDay ? 'rgba(100,170,220,0.5)' : 'rgba(100,80,180,0.4)',
          }}
          aria-label="Toggle day/night theme"
        >
          {/* Track stars (night) */}
          {!isDay && (
            <span className="absolute inset-0 overflow-hidden rounded-full">
              {[{x:4, y:2, s:1}, {x:8, y:5, s:0.7}, {x:3, y:5, s:0.8}].map((st, i) => (
                <span key={i} className="absolute rounded-full bg-white/70"
                  style={{ left: st.x, top: st.y, width: st.s * 2, height: st.s * 2 }} />
              ))}
            </span>
          )}
          {/* Track clouds (day) */}
          {isDay && (
            <span className="absolute inset-0 overflow-hidden rounded-full">
              <span className="absolute" style={{ left: 2, top: 3, opacity: 0.7 }}>
                <svg width="18" height="8"><ellipse cx="9" cy="5" rx="8" ry="3.5" fill="white" opacity="0.7" /></svg>
              </span>
            </span>
          )}
          {/* Sliding orb */}
          <motion.div
            layout
            animate={{ x: isDay ? 30 : 3 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="w-[22px] h-[22px] rounded-full flex items-center justify-center shadow-md z-10 relative"
            style={{
              background: isDay
                ? 'radial-gradient(circle at 35% 35%, #fff9c4, #fcd34d 60%, #f59e0b)'
                : 'radial-gradient(circle at 38% 32%, #e8dff5, #c4b5f0 50%, #8b5cf6 90%)',
              boxShadow: isDay
                ? '0 0 8px 3px rgba(252,211,77,0.6), 0 2px 4px rgba(0,0,0,0.3)'
                : '0 0 8px 3px rgba(139,92,246,0.5), 0 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            {isDay ? <SunIcon /> : <MoonIcon />}
          </motion.div>
        </button>
      </div>

      {/* Character Mini HUD */}
      {character && (
        <div className="px-4 py-3 border-b border-white/10">
          <div className="glass-card rounded-xl p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-lavender">Lv.{character.level}</span>
              <GoldCounter amount={character.gold} />
            </div>
            <div className="text-xs truncate font-medium" style={{ color: 'var(--theme-text-muted)' }}>{character.className}</div>
            {/* Mini XP Bar */}
            <div className="w-full h-1 bg-white/10 rounded-full">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-purple-muted to-purple-glow"
                animate={{ width: `${Math.min((character.xp / character.nextLevelXp) * 100, 100)}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Lumi */}
      <div className="flex justify-center py-4 border-b border-white/10">
        <LumiCompanion size="sm" showSpeech={false} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto no-scrollbar" aria-label="Main navigation">
        {navLinks.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => isActive ? 'nav-item-active' : 'nav-item'}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-3 border-t border-white/10">
        <div className="px-4 py-2 text-xs truncate mb-2" style={{ color: 'var(--theme-text-muted)' }}>{user?.username}</div>
        <button onClick={handleLogout} className="nav-item w-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  )
}


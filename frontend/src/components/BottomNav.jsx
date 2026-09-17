import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Swords, Gamepad2, Map, User, Trophy } from 'lucide-react'

const items = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Home'    },
  { to: '/quests',       icon: Swords,          label: 'Quests'  },
  { to: '/game-realm',   icon: Gamepad2,        label: 'Games'   },
  { to: '/quest-map',   icon: Map,             label: 'Map'     },
  { to: '/character',   icon: User,            label: 'Hero'    },
]

export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 lg:hidden z-40 bg-navy/95 backdrop-blur border-t border-white/10"
      aria-label="Mobile navigation"
    >
      <div className="mobile-nav-inner flex items-center justify-around px-2 py-2">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all min-w-[44px] min-h-[44px] justify-center ${
                isActive
                  ? 'text-lavender bg-purple-glow/20'
                  : 'text-starlight-dim hover:text-starlight'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

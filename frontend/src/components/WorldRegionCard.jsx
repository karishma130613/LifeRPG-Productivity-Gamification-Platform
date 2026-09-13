import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import * as LucideIcons from 'lucide-react'

const colorMap = {
  indigo:   { card: 'border-indigo-500/30 bg-indigo-500/5',  icon: 'text-indigo-400  bg-indigo-400/10',  text: 'text-indigo-300' },
  purple:   { card: 'border-purple-500/30 bg-purple-500/5', icon: 'text-purple-glow bg-purple-glow/10', text: 'text-lavender'   },
  cyan:     { card: 'border-cyan-500/30   bg-cyan-500/5',    icon: 'text-cyan-400    bg-cyan-400/10',    text: 'text-cyan-300'   },
  emerald:  { card: 'border-emerald-500/30 bg-emerald-500/5',icon: 'text-emerald-400 bg-emerald-400/10',  text: 'text-emerald-300'},
  amber:    { card: 'border-amber-500/30  bg-amber-500/5',   icon: 'text-amber-400   bg-amber-400/10',   text: 'text-amber-300'  },
}

export default function WorldRegionCard({ region }) {
  const colors  = colorMap[region.themeColor] || colorMap.purple
  const Icon    = LucideIcons[region.iconName] || LucideIcons.Globe
  const unlocked = region.isUnlocked

  return (
    <motion.div
      className={`glass-card rounded-2xl p-5 border ${colors.card} ${unlocked ? '' : 'opacity-40 grayscale'} transition-all duration-300`}
      whileHover={unlocked ? { y: -2, scale: 1.01 } : {}}
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colors.icon}`}>
          {unlocked
            ? <Icon className="w-6 h-6" />
            : <Lock className="w-5 h-5 text-starlight-dim" />
          }
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-display font-bold text-sm ${unlocked ? colors.text : 'text-starlight-dim'}`}>
              {region.regionName}
            </h3>
            {unlocked && (
              <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded-full font-medium">
                Unlocked
              </span>
            )}
          </div>
          <p className="text-xs text-starlight-dim leading-relaxed line-clamp-2">{region.description}</p>
          <p className="text-xs text-starlight-dim mt-2">
            {unlocked ? '✦ Active Region' : `🔒 Requires Level ${region.minLevel}`}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

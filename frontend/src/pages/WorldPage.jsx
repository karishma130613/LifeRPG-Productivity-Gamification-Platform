import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Globe, Sparkles, MapPin, Lock, CheckCircle2, ShieldAlert } from 'lucide-react'
import { worldService, characterService } from '../services/services'
import WorldRegionCard from '../components/WorldRegionCard'
import { useGame } from '../context/GameContext'

export default function WorldPage() {
  const { character, updateCharacter } = useGame()
  const [regions, setRegions] = useState([])
  const [loading, setLoading] = useState(true)

  const loadWorldData = useCallback(async () => {
    try {
      setLoading(true)
      const [worldData, charData] = await Promise.allSettled([
        worldService.getWorld(),
        characterService.getCharacter(),
      ])
      if (worldData.status === 'fulfilled') setRegions(worldData.value || [])
      if (charData.status === 'fulfilled') updateCharacter(charData.value)
    } catch (err) {
      console.error('Failed to load world regions:', err)
    } finally {
      setLoading(false)
    }
  }, [updateCharacter])

  useEffect(() => {
    loadWorldData()
  }, [loadWorldData])

  const unlockedCount = regions.filter((r) => r.isUnlocked).length
  const totalCount = regions.length || 5
  const illuminationPercent = Math.round((unlockedCount / totalCount) * 100)

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 lg:p-8 glass-card rounded-3xl border border-white/10 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>The Starlight Realms</span>
          </div>
          <h1 className="font-title text-3xl sm:text-4xl font-extrabold text-white">
            World of Illumination
          </h1>
          <p className="text-xs sm:text-sm text-starlight-muted leading-relaxed">
            Every habit conquered and level reached restores celestial starlight to
            uncharted regions across the universe. Current Hero Level:{' '}
            <span className="font-bold text-gold">Level {character?.level || 1}</span>.
          </p>

          <div className="pt-2">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-starlight-muted font-semibold">Realm Illumination</span>
              <span className="font-mono text-gold font-bold">{illuminationPercent}% Restored</span>
            </div>
            <div className="w-full h-3 rounded-full bg-midnight border border-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 via-amber-400 to-gold rounded-full transition-all duration-500"
                style={{ width: `${illuminationPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Regions Grid */}
      {loading ? (
        <div className="p-16 text-center text-starlight-muted">
          <Sparkles className="w-6 h-6 text-gold animate-spin mx-auto mb-2" />
          <p className="text-xs">Illuminating the celestial map...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regions.map((region) => (
            <WorldRegionCard key={region.id} region={region} />
          ))}
        </div>
      )}
    </div>
  )
}

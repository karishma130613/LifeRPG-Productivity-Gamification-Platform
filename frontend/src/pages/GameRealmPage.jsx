import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Gamepad2,
  Trophy,
  Zap,
  Coins,
  Sparkles,
  Lock,
  Play,
  Clock,
  Target,
  Flame,
  CheckCircle2,
  ChevronRight,
  Shield,
  Brain,
  Binary,
  BookOpen,
} from 'lucide-react'
import { gameService } from '../services/services'
import { useGame } from '../context/GameContext'
import GameModal from '../components/games/GameModal'
import confetti from 'canvas-confetti'

const ZONES = [
  { id: 'ALL', name: 'All Realms', minLevel: 1 },
  { id: 'Star Meadow', name: '🌌 Star Meadow', minLevel: 1 },
  { id: 'Crystal Library', name: '🧠 Crystal Library', minLevel: 3 },
  { id: 'Focus Arena', name: '⚡ Focus Arena', minLevel: 5 },
  { id: 'Dragon Forge', name: '🔥 Dragon Forge', minLevel: 8 },
  { id: 'Celestial Arcade', name: '👑 Celestial Arcade', minLevel: 10 },
]

export default function GameRealmPage() {
  const { character, updateCharacter, spawnFloatingXP, spawnFloatingGold } = useGame()

  const [games, setGames] = useState([])
  const [stats, setStats] = useState(null)
  const [dailyChallenge, setDailyChallenge] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedZone, setSelectedZone] = useState('ALL')
  const [activeGameForPlay, setActiveGameForPlay] = useState(null)
  const [claimingDaily, setClaimingDaily] = useState(false)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const [gamesData, statsData, challengeData, lbData, histData] = await Promise.allSettled([
        gameService.getGames(),
        gameService.getGameStats(),
        gameService.getDailyChallenge(),
        gameService.getLeaderboard(),
        gameService.getHistory(),
      ])

      if (gamesData.status === 'fulfilled') setGames(gamesData.value || [])
      if (statsData.status === 'fulfilled') setStats(statsData.value)
      if (challengeData.status === 'fulfilled') setDailyChallenge(challengeData.value)
      if (lbData.status === 'fulfilled') setLeaderboard(lbData.value || [])
      if (histData.status === 'fulfilled') setHistory(histData.value || [])
    } catch (err) {
      console.error('Failed to load Game Realm data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleClaimDailyChallenge = async () => {
    if (claimingDaily || !dailyChallenge?.isReadyToClaim) return
    setClaimingDaily(true)
    try {
      const res = await gameService.claimDailyChallenge()
      if (res.updatedCharacter) {
        updateCharacter(res.updatedCharacter)
      }
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } })
      spawnFloatingXP(150)
      spawnFloatingGold(75)
      loadData()
    } catch (err) {
      console.error('Failed to claim daily challenge:', err)
    } finally {
      setClaimingDaily(false)
    }
  }

  const filteredGames = games.filter((g) => {
    if (selectedZone === 'ALL') return true
    return g.zoneName === selectedZone
  })

  const playerLevel = character?.level || 1

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* 1. Header Banner */}
      <div className="relative p-6 sm:p-8 glass-card rounded-3xl border border-purple-500/25 overflow-hidden shadow-2xl bg-gradient-to-r from-purple-950/40 via-midnight to-navy">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-purple-500/20 text-purple-300 border border-purple-400/30 flex items-center gap-1.5 shadow-sm">
                <Gamepad2 className="w-3.5 h-3.5 text-gold" />
                <span>Fantasy Arcade</span>
              </span>
              <span className="text-xs font-mono text-starlight-muted">
                Zone Access: Lv.{playerLevel}
              </span>
            </div>

            <h1 className="font-title text-3xl sm:text-4xl font-black text-white flex items-center gap-3">
              <span>The Game Realm</span>
              <Sparkles className="w-6 h-6 text-gold animate-spin" style={{ animationDuration: '8s' }} />
            </h1>

            <p className="text-xs sm:text-sm text-starlight-muted leading-relaxed">
              Step into the starlight training grounds. Hone your memory, logic, arithmetic, precision, and agility
              to harvest real RPG experience, gold, and deal devastating strikes to active Bosses!
            </p>
          </div>

          {/* Lumi Encouragement Bubble */}
          <div className="glass-card rounded-2xl p-4 border border-purple-400/25 flex items-center gap-3.5 bg-midnight/80 shadow-glow-gold max-w-sm flex-shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-gold p-0.5 shadow-sm flex-shrink-0">
              <div className="w-full h-full rounded-2xl bg-midnight flex items-center justify-center text-xl">
                ✨
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-gold font-bold uppercase">Lumi's Arcade Tip</div>
              <p className="text-xs text-starlight leading-tight mt-0.5">
                &quot;Playing a quick trial before deep work activates your focus circuits! Have fun!&quot;
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Player Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl glass-card border border-white/10 flex flex-col items-center text-center">
          <span className="text-[10px] uppercase font-mono text-starlight-muted font-semibold">Games Played</span>
          <span className="font-title text-2xl font-black text-white mt-1">{stats?.totalGamesPlayed || 0}</span>
        </div>
        <div className="p-4 rounded-2xl glass-card border border-white/10 flex flex-col items-center text-center">
          <span className="text-[10px] uppercase font-mono text-starlight-muted font-semibold">Games Won</span>
          <span className="font-title text-2xl font-black text-emerald-400 mt-1">{stats?.totalGamesWon || 0}</span>
        </div>
        <div className="p-4 rounded-2xl glass-card border border-white/10 flex flex-col items-center text-center">
          <span className="text-[10px] uppercase font-mono text-starlight-muted font-semibold">Daily Streak</span>
          <span className="font-title text-2xl font-black text-gold mt-1 flex items-center gap-1">
            <Flame className="w-5 h-5 fill-gold text-gold" />
            {stats?.currentStreak || 0}d
          </span>
        </div>
        <div className="p-4 rounded-2xl glass-card border border-white/10 flex flex-col items-center text-center">
          <span className="text-[10px] uppercase font-mono text-starlight-muted font-semibold">Total XP Earned</span>
          <span className="font-title text-2xl font-black text-purple-300 mt-1">+{stats?.totalXpEarned || 0}</span>
        </div>
        <div className="p-4 rounded-2xl glass-card border border-white/10 flex flex-col items-center text-center">
          <span className="text-[10px] uppercase font-mono text-starlight-muted font-semibold">Total Gold</span>
          <span className="font-title text-2xl font-black text-gold mt-1">+{stats?.totalGoldEarned || 0}</span>
        </div>
        <div className="p-4 rounded-2xl glass-card border border-white/10 flex flex-col items-center text-center">
          <span className="text-[10px] uppercase font-mono text-starlight-muted font-semibold">Best Score</span>
          <span className="font-title text-2xl font-black text-cyan-300 mt-1">{stats?.overallBestScore || 0}</span>
        </div>
      </div>

      {/* 3. Daily Game Challenge Card */}
      {dailyChallenge && (
        <div className="p-5 sm:p-6 rounded-3xl glass-card border border-gold/30 bg-gradient-to-r from-purple-900/30 via-midnight to-amber-950/20 shadow-glow-gold flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-md flex-shrink-0">
              <div className="w-full h-full rounded-2xl bg-midnight flex items-center justify-center text-gold">
                <Trophy className="w-7 h-7" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono font-black text-gold bg-gold/20 px-2 py-0.5 rounded-full border border-gold/40">
                  Daily Challenge
                </span>
                <span className="text-xs font-mono text-starlight-muted">Resets Midnight</span>
              </div>
              <h3 className="font-title text-lg font-bold text-white mt-1">
                Play Any 2 Mini-Games Today
              </h3>
              <p className="text-xs text-starlight-muted mt-0.5">
                Harvest bonus <span className="text-purple-300 font-bold">+150 XP</span> and <span className="text-gold font-bold">+75 Gold</span> upon completing 2 challenges!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            {/* Progress Bar */}
            <div className="w-36 space-y-1">
              <div className="flex justify-between text-[11px] font-mono text-starlight-muted">
                <span>Progress</span>
                <span className="text-gold font-bold">
                  {dailyChallenge.completedCount} / {dailyChallenge.targetCount}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-amber-400 rounded-full"
                  style={{
                    width: `${Math.min(100, (dailyChallenge.completedCount / dailyChallenge.targetCount) * 100)}%`,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Claim / Status Button */}
            {dailyChallenge.isClaimed ? (
              <span className="px-4 py-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Claimed Today</span>
              </span>
            ) : (
              <button
                onClick={handleClaimDailyChallenge}
                disabled={!dailyChallenge.isReadyToClaim || claimingDaily}
                className={`px-5 py-2.5 rounded-2xl text-xs font-black font-mono transition-all flex items-center gap-2 ${
                  dailyChallenge.isReadyToClaim
                    ? 'btn-gold shadow-glow-gold hover:scale-105 animate-pulse'
                    : 'bg-white/5 border border-white/10 text-starlight-muted cursor-not-allowed opacity-60'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{dailyChallenge.isReadyToClaim ? 'Claim Daily Bonus' : '2 Games Needed'}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 4. Realm Zone Tabs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="font-title text-xl font-bold text-white flex items-center gap-2">
              <span>Astral Game Zones</span>
            </h2>
            <p className="text-xs text-starlight-muted mt-0.5">
              Unlock higher-tier training zones as your character levels up.
            </p>
          </div>

          {/* Zones selector buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {ZONES.map((zone) => {
              const isSelected = selectedZone === zone.id
              const isZoneLocked = playerLevel < zone.minLevel
              return (
                <button
                  key={zone.id}
                  onClick={() => setSelectedZone(zone.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-purple-600/40 text-white border border-purple-400 shadow-glow-gold'
                      : 'glass-card border border-white/5 text-starlight-muted hover:text-white'
                  }`}
                >
                  {isZoneLocked && <Lock className="w-3 h-3 text-red-400" />}
                  <span>{zone.name}</span>
                  {zone.minLevel > 1 && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 font-mono">
                      Lv.{zone.minLevel}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* 5. Game Cards Grid */}
        {loading ? (
          <div className="p-16 text-center text-starlight-muted">
            <Sparkles className="w-7 h-7 text-gold animate-spin mx-auto mb-2" />
            <p className="text-xs">Illuminating the game constellation...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredGames.map((game) => {
              const isLocked = !game.isUnlocked

              return (
                <motion.div
                  key={game.id}
                  whileHover={!isLocked ? { y: -4 } : {}}
                  className={`relative glass-card rounded-3xl p-5 border transition-all flex flex-col justify-between overflow-hidden ${
                    isLocked
                      ? 'border-white/5 opacity-60 bg-navy/40'
                      : 'border-purple-500/20 hover:border-purple-400/50 hover:shadow-2xl hover:shadow-purple-900/20'
                  }`}
                >
                  {/* Card Top */}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-amber-500/10 border border-white/15 flex items-center justify-center text-2xl shadow-inner">
                        {game.id === 'memory-stars' && '⭐'}
                        {game.id === 'mind-maze' && '🧠'}
                        {game.id === 'number-forge' && '🔢'}
                        {game.id === 'word-quest' && '📖'}
                        {game.id === 'focus-strike' && '🎯'}
                        {game.id === 'star-catcher' && '🌟'}
                      </div>

                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-mono font-bold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-400/30">
                          {game.zoneName}
                        </span>
                        <span className="text-[10px] font-mono text-starlight-muted mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-cyan-400" />
                          {game.estimatedTime}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-title text-lg font-bold text-white mb-1">
                      {game.name}
                    </h3>

                    <p className="text-xs text-starlight-muted leading-relaxed line-clamp-2 mb-4">
                      {game.description}
                    </p>
                  </div>

                  {/* Card Bottom Meta */}
                  <div className="space-y-3 pt-3 border-t border-white/5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-starlight-muted">Reward:</span>
                      <span className="text-gold font-bold flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-purple-400" />
                        +50-150 XP
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-starlight-muted">Attribute:</span>
                      <span className="text-cyan-300 font-bold">
                        +{game.attributeType}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-starlight-muted">Best Score:</span>
                      <span className="text-white font-bold">
                        {game.bestScore > 0 ? game.bestScore : '—'}
                      </span>
                    </div>

                    {/* Play Button or Lock Badge */}
                    {isLocked ? (
                      <div className="w-full py-2.5 rounded-2xl bg-white/5 border border-white/10 text-red-300 text-xs font-mono font-bold flex items-center justify-center gap-2">
                        <Lock className="w-3.5 h-3.5 text-red-400" />
                        <span>Unlock at Level {game.requiredLevel}</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => setActiveGameForPlay(game)}
                        className="w-full btn-gold py-2.5 rounded-2xl text-xs font-black shadow-glow-gold hover:scale-102 transition-all flex items-center justify-center gap-2"
                      >
                        <Play className="w-3.5 h-3.5 fill-midnight" />
                        <span>PLAY TRIAL</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* 6. Leaderboard & Recent Activity Dual Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        {/* Leaderboard */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 bg-midnight/90 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-title text-base font-bold text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-gold" />
              <span>Starlight Arcade Leaderboard</span>
            </h3>
            <span className="text-[10px] font-mono text-starlight-muted">Top Champions</span>
          </div>

          {leaderboard.length === 0 ? (
            <div className="p-8 text-center text-xs text-starlight-muted font-mono">
              The arena is waiting for its first champion! Play a trial to make history.
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {leaderboard.map((entry, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                      idx === 0 ? 'bg-gold text-midnight' : idx === 1 ? 'bg-starlight text-midnight' : idx === 2 ? 'bg-amber-600 text-white' : 'bg-white/10 text-starlight-muted'
                    }`}>
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-bold text-white">{entry.username}</div>
                      <div className="text-[10px] text-starlight-muted font-mono">{entry.className} • Lv.{entry.level}</div>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <div className="text-gold font-bold">{entry.bestScore} pts</div>
                    <div className="text-[10px] text-starlight-muted">{entry.gamesWon} wins</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Game Activity */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 bg-midnight/90 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-title text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Your Recent Activity</span>
            </h3>
            <span className="text-[10px] font-mono text-starlight-muted">Last 10 Trials</span>
          </div>

          {history.length === 0 ? (
            <div className="p-8 text-center text-xs text-starlight-muted font-mono">
              Your adventure starts here! Play your first mini-game to begin your legend.
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {history.map((sess) => (
                <div
                  key={sess.id}
                  className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-white uppercase">{sess.gameId.replace('-', ' ')}</div>
                    <div className="text-[10px] text-starlight-muted font-mono">
                      Diff: {sess.difficulty} • Score: {sess.score}
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                      COMPLETED
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 7. Active Game Modal */}
      {activeGameForPlay && (
        <GameModal
          game={activeGameForPlay}
          onClose={() => setActiveGameForPlay(null)}
          onGameFinished={() => {
            loadData()
          }}
        />
      )}
    </div>
  )
}

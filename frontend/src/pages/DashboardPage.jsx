import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Sparkles,
  Plus,
  Compass,
  Sword,
  ShieldAlert,
  Flame,
  Zap,
  Calendar,
  ChevronRight,
  RefreshCw,
  Award,
  Coins,
  Brain,
  CheckCircle2,
  Gamepad2,
  Trophy,
} from 'lucide-react'
import { useGame } from '../context/GameContext'
import {
  characterService,
  questService,
  bossService,
  mainQuestService,
  worldService,
  eventService,
  gameService,
} from '../services/services'
import LumiCompanion from '../components/LumiCompanion'
import QuestCard from '../components/QuestCard'
import BossCard from '../components/BossCard'
import QuestFormModal from '../components/QuestFormModal'
import AiPlannerModal from '../components/AiPlannerModal'
import QuestGameArenaModal from '../components/QuestGameArenaModal'
import GameModal from '../components/games/GameModal'
import { XPBar, AttributeBar } from '../components/HUDComponents'

export default function DashboardPage() {
  const {
    character,
    updateCharacter,
    lumiMessage,
    lumiState,
    triggerReward,
    triggerLevelUp,
    spawnFloatingXP,
    spawnFloatingGold,
  } = useGame()

  const [quests, setQuests] = useState([])
  const [bosses, setBosses] = useState([])
  const [mainQuests, setMainQuests] = useState([])
  const [worldRegions, setWorldRegions] = useState([])
  const [dailyEvent, setDailyEvent] = useState(null)
  const [gameStats, setGameStats] = useState(null)
  const [dailyChallenge, setDailyChallenge] = useState(null)
  const [claimingChallenge, setClaimingChallenge] = useState(false)
  const [loading, setLoading] = useState(true)

  // Modals
  const [showQuestModal, setShowQuestModal] = useState(false)
  const [showAiModal, setShowAiModal] = useState(false)
  const [activeQuestForTrial, setActiveQuestForTrial] = useState(null)
  const [activeQuickGame, setActiveQuickGame] = useState(null)

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      const [charData, questData, bossData, mqData, worldData, eventData, statsData, challengeData] =
        await Promise.allSettled([
          characterService.getCharacter(),
          questService.getQuests({ status: 'ACTIVE' }),
          bossService.getBosses(),
          mainQuestService.getMainQuests(),
          worldService.getWorld(),
          eventService.getTodayEvent(),
          gameService.getGameStats(),
          gameService.getDailyChallenge(),
        ])

      if (charData.status === 'fulfilled') updateCharacter(charData.value)
      if (questData.status === 'fulfilled') setQuests(questData.value || [])
      if (bossData.status === 'fulfilled') setBosses(bossData.value || [])
      if (mqData.status === 'fulfilled') setMainQuests(mqData.value || [])
      if (worldData.status === 'fulfilled') setWorldRegions(worldData.value || [])
      if (eventData.status === 'fulfilled') setDailyEvent(eventData.value)
      if (statsData.status === 'fulfilled') setGameStats(statsData.value)
      if (challengeData.status === 'fulfilled') setDailyChallenge(challengeData.value)
    } catch (err) {
      console.error('Error loading dashboard:', err)
    } finally {
      setLoading(false)
    }
  }, [updateCharacter])

  useEffect(() => {
    loadDashboardData()
  }, [loadDashboardData])

  const handleClaimDailyChallenge = async () => {
    if (claimingChallenge) return
    setClaimingChallenge(true)
    try {
      const res = await gameService.claimDailyChallenge()
      if (res.updatedCharacter) {
        updateCharacter(res.updatedCharacter)
      }
      spawnFloatingXP(res.xpEarned || 100)
      spawnFloatingGold(res.goldEarned || 50)
      triggerReward({
        title: 'Daily Game Challenge Claimed!',
        xpGained: res.xpEarned || 100,
        goldGained: res.goldEarned || 50,
      })
      const updatedChallenge = await gameService.getDailyChallenge()
      setDailyChallenge(updatedChallenge)
    } catch (err) {
      console.error('Failed to claim daily game challenge:', err)
    } finally {
      setClaimingChallenge(false)
    }
  }

  const handleQuestComplete = (questOrId) => {
    if (typeof questOrId === 'object' && questOrId !== null) {
      setActiveQuestForTrial(questOrId)
    } else {
      const q = quests.find((item) => item.id === questOrId)
      if (q) setActiveQuestForTrial(q)
    }
  }

  const handleVictoryComplete = async (questId) => {
    try {
      const result = await questService.completeQuest(questId)

      // Update character in context (backend returns updatedCharacter)
      if (result.updatedCharacter) {
        updateCharacter(result.updatedCharacter)
      }

      // Spawning reward numbers
      spawnFloatingXP(result.xpGained || 25)
      spawnFloatingGold(result.goldGained || 10)

      // Trigger reward modal
      triggerReward(result)

      if (result.leveledUp) {
        triggerLevelUp(result)
      }

      // Refresh quests and bosses to show real-time HP depletion
      loadDashboardData()
    } catch (err) {
      console.error('Failed to complete quest:', err)
    }
  }

  const handleDeleteQuest = async (questId) => {
    if (!window.confirm('Abandon this quest?')) return
    try {
      await questService.deleteQuest(questId)
      loadDashboardData()
    } catch (err) {
      console.error('Failed to delete quest:', err)
    }
  }

  const activeBoss = bosses.find((b) => !b.defeated) || bosses[0]
  const activeMainQuest = mainQuests.find((m) => m.status !== 'COMPLETED') || mainQuests[0]
  const unlockedWorldCount = worldRegions.filter((r) => r.unlocked).length

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 glass-card rounded-2xl border border-white/10 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-rpg via-purple-600 to-gold p-0.5 shadow-glow-gold flex-shrink-0">
            <div className="w-full h-full rounded-2xl bg-midnight flex items-center justify-center font-title text-2xl font-black text-gold">
              {character?.username?.charAt(0)?.toUpperCase() || 'H'}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-title text-2xl sm:text-3xl font-bold text-white">
                {character?.username || 'Hero'}
              </h1>
              <span className="badge-gold">
                Lvl {character?.level || 1}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {character?.dnaClass || 'Novice Seeker'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-starlight-muted mt-1 flex items-center gap-2">
              <span>{character?.title || 'Wanderer of the Starlight Realm'}</span>
              <span className="text-white/30">•</span>
              <span className="text-gold flex items-center gap-1 font-semibold">
                <Coins className="w-3.5 h-3.5 text-gold" />
                {character?.gold || 0} Gold
              </span>
              <span className="text-white/30">•</span>
              <span className="text-amber-400 flex items-center gap-1 font-semibold">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                {character?.currentStreak || 0}d Streak
              </span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setShowAiModal(true)}
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl glass-card border border-purple-500/40 text-purple-200 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 hover:bg-purple-500/20 transition-colors"
          >
            <Zap className="w-4 h-4 text-purple-400" />
            <span>AI Quest Planner</span>
          </button>
          <button
            onClick={() => setShowQuestModal(true)}
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl btn-gold text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-glow-gold"
          >
            <Plus className="w-4 h-4" />
            <span>New Quest</span>
          </button>
        </div>
      </div>

      {/* Companion Quote & Level Progress Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lumi Companion Card */}
        <div className="lg:col-span-1 p-5 glass-card rounded-2xl border border-white/10 flex items-center gap-4 relative">
          <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center">
            <LumiCompanion state={lumiState} message="" hideBubble={true} size="md" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold tracking-wider uppercase text-gold mb-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-gold" />
              <span>Lumi Companion</span>
            </div>
            <p className="text-xs sm:text-sm text-starlight-light leading-relaxed italic">
              "{lumiMessage}"
            </p>
          </div>
        </div>

        {/* Level XP Bar & Life DNA Mini HUD */}
        <div className="lg:col-span-2 p-5 glass-card rounded-2xl border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-starlight-muted mb-2">
              <span className="font-semibold text-white">Level Progression</span>
              <span className="font-mono text-gold">
                {character?.currentXp || 0} / {character?.nextLevelXp || 100} XP
              </span>
            </div>
            <XPBar current={character?.currentXp || 0} max={character?.nextLevelXp || 100} />
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-4 pt-4 border-t border-white/10 text-center">
            {[
              { label: 'STR', val: character?.strength || 10, color: 'text-red-400' },
              { label: 'INT', val: character?.intellect || 10, color: 'text-blue-400' },
              { label: 'DIS', val: character?.discipline || 10, color: 'text-amber-400' },
              { label: 'CRE', val: character?.creativity || 10, color: 'text-purple-400' },
              { label: 'VIT', val: character?.vitality || 10, color: 'text-emerald-400' },
              { label: 'CHA', val: character?.charisma || 10, color: 'text-pink-400' },
            ].map((stat, i) => (
              <div key={i} className="p-2 rounded-lg bg-white/5 border border-white/5">
                <div className="text-[10px] text-starlight-muted font-bold tracking-wider">{stat.label}</div>
                <div className={`font-mono text-sm font-bold ${stat.color}`}>{stat.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Event / Bonus Banner */}
      {dailyEvent && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-purple-900/40 via-midnight to-navy border border-purple-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-gold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-gold uppercase tracking-wider">
                Daily Celestial Event • {dailyEvent.name}
              </div>
              <p className="text-xs text-starlight-muted mt-0.5">
                {dailyEvent.description || 'Complete quests today for bonus Starlight blessings!'}
              </p>
            </div>
          </div>
          <span className="badge-purple font-mono text-xs">
            +{dailyEvent.bonusXpPercent || 15}% XP
          </span>
        </div>
      )}

      {/* Main Content Layout: Quests + Sidebar widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Active Quests */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sword className="w-5 h-5 text-gold" />
              <h2 className="font-title text-xl font-bold text-white">
                Active Quests ({quests.length})
              </h2>
            </div>
            <Link
              to="/quests"
              className="text-xs font-semibold text-gold hover:text-amber-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {quests.length === 0 ? (
            <div className="p-12 glass-card rounded-2xl border border-white/10 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-starlight-muted">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-title text-lg font-bold text-white">All Quests Complete!</h3>
                <p className="text-xs text-starlight-muted max-w-sm mx-auto mt-1">
                  You've conquered your list for now. Add new habits or generate a blueprint with the AI Planner.
                </p>
              </div>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setShowQuestModal(true)}
                  className="btn-gold text-xs font-bold px-4 py-2"
                >
                  Create Quest
                </button>
                <button
                  onClick={() => setShowAiModal(true)}
                  className="btn-ghost text-xs font-semibold px-4 py-2"
                >
                  AI Planner
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {quests.slice(0, 5).map((q) => (
                <QuestCard
                  key={q.id}
                  quest={q}
                  onComplete={handleQuestComplete}
                  onDelete={handleDeleteQuest}
                  onUpdated={loadDashboardData}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Game Realm + Boss + Main Quest + World widgets */}
        <div className="space-y-6">
          {/* Game Realm & Daily Challenge Widget */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-amber-400" />
                <h2 className="font-title text-lg font-bold text-white">Daily Game Challenge</h2>
              </div>
              <Link to="/game-realm" className="text-xs text-gold hover:text-amber-300 flex items-center gap-1 font-semibold">
                <span>Game Realm</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-5 glass-card rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-950/40 via-midnight to-midnight space-y-3.5 shadow-glow-gold/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">Daily Celestial Trial</span>
                  {dailyChallenge?.claimed && (
                    <span className="badge-emerald text-[10px]">Claimed</span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs font-mono text-amber-400 font-bold">
                  <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{gameStats?.currentStreak || 0}d Streak</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-starlight-muted">Games Completed Today</span>
                  <span className="text-purple-300 font-bold">
                    {dailyChallenge?.completedGames || 0} / {dailyChallenge?.targetGames || 2}
                  </span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-amber-400 transition-all duration-500 rounded-full"
                    style={{
                      width: `${Math.min(100, (((dailyChallenge?.completedGames || 0) / (dailyChallenge?.targetGames || 2)) * 100))}%`,
                    }}
                  />
                </div>
              </div>

              {/* Action */}
              {dailyChallenge?.canClaim ? (
                <button
                  onClick={handleClaimDailyChallenge}
                  disabled={claimingChallenge}
                  className="w-full py-2 rounded-xl btn-gold text-xs font-black flex items-center justify-center gap-1.5 shadow-glow-gold"
                >
                  <Trophy className="w-3.5 h-3.5 text-midnight" />
                  <span>{claimingChallenge ? 'Claiming...' : 'Claim 100 XP + 50 Gold'}</span>
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => setActiveQuickGame({
                      id: 'memory-stars',
                      name: 'Memory Stars',
                      description: 'Match celestial constellation cards to empower your mind and strike the active Boss!',
                      availableDifficulties: ['EASY', 'MEDIUM', 'HARD'],
                      zoneName: 'Star Meadow',
                      attributeType: 'INTELLECT',
                    })}
                    className="py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>⭐ Quick Play</span>
                  </button>
                  <Link
                    to="/game-realm"
                    className="py-2 px-3 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-xs font-bold text-purple-200 hover:text-white flex items-center justify-center gap-1 transition-all"
                  >
                    <span>Arcade (6) →</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Boss Battle Teaser */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-400" />
                <h2 className="font-title text-lg font-bold text-white">Boss Encounter</h2>
              </div>
              <Link to="/boss" className="text-xs text-gold hover:text-amber-300 flex items-center gap-1 font-semibold">
                <span>Raid Hall</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {activeBoss ? (
              <BossCard boss={activeBoss} />
            ) : (
              <div className="p-6 glass-card rounded-xl border border-white/10 text-center">
                <p className="text-xs text-starlight-muted">No active boss monster summoned.</p>
                <Link to="/boss" className="mt-2 inline-block text-xs font-bold text-gold">
                  Summon a Boss Challenge →
                </Link>
              </div>
            )}
          </div>

          {/* Main Quest Journey Widget */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-starlight-blue" />
                <h2 className="font-title text-lg font-bold text-white">Epic Journey</h2>
              </div>
              <Link to="/quest-map" className="text-xs text-gold hover:text-amber-300 flex items-center gap-1 font-semibold">
                <span>View Map</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {activeMainQuest ? (
              <div className="p-5 glass-card rounded-xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="badge-purple text-[10px]">{activeMainQuest.category || 'Journey'}</span>
                  <span className="text-xs font-mono text-starlight-muted">
                    {activeMainQuest.nodes?.filter((n) => n.completed)?.length || 0} / {activeMainQuest.nodes?.length || 0} Nodes
                  </span>
                </div>
                <h3 className="font-title text-base font-bold text-white">
                  {activeMainQuest.title}
                </h3>
                <p className="text-xs text-starlight-muted line-clamp-2">
                  {activeMainQuest.description}
                </p>
                <Link
                  to="/quest-map"
                  className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Enter Journey Map</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="p-6 glass-card rounded-xl border border-white/10 text-center">
                <p className="text-xs text-starlight-muted">No active multi-stage quest line.</p>
                <Link to="/quest-map" className="mt-2 inline-block text-xs font-bold text-gold">
                  Forge an Epic Journey →
                </Link>
              </div>
            )}
          </div>

          {/* Starlight World Widget */}
          <div className="p-5 glass-card rounded-xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold" />
                <h3 className="font-title text-sm font-bold text-white">Starlight Realms</h3>
              </div>
              <span className="badge-gold text-[10px]">
                {unlockedWorldCount} / {worldRegions.length || 5} Unlocked
              </span>
            </div>
            <p className="text-xs text-starlight-muted">
              Higher levels unlock mysterious zones and passive attribute blessings.
            </p>
            <Link
              to="/world"
              className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Explore World Map</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showQuestModal && (
        <QuestFormModal
          onClose={() => setShowQuestModal(false)}
          onSaved={() => {
            setShowQuestModal(false)
            loadDashboardData()
          }}
        />
      )}

      {showAiModal && (
        <AiPlannerModal
          onClose={() => setShowAiModal(false)}
          onPlanAccepted={() => {
            setShowAiModal(false)
            loadDashboardData()
          }}
        />
      )}

      {/* Quest Trial Game Arena Modal */}
      {activeQuestForTrial && (
        <QuestGameArenaModal
          quest={activeQuestForTrial}
          onClose={() => setActiveQuestForTrial(null)}
          onVictoryComplete={handleVictoryComplete}
        />
      )}

      {/* Game Realm Quick Game Modal */}
      {activeQuickGame && (
        <GameModal
          game={activeQuickGame}
          onClose={() => setActiveQuickGame(null)}
          onGameFinished={() => {
            loadDashboardData()
          }}
        />
      )}
    </div>
  )
}

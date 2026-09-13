import { createContext, useContext, useState, useCallback, useRef } from 'react'

const GameContext = createContext(null)

export const GameProvider = ({ children }) => {
  const [character, setCharacter] = useState(null)
  const [lumiMessage, setLumiMessage] = useState("Welcome back, adventurer! ✨")
  const [lumiState, setLumiState]     = useState('idle')   // idle|happy|excited|thinking|celebrating|victory
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [levelUpData, setLevelUpData] = useState(null)
  const [showReward, setShowReward]   = useState(false)
  const [rewardData, setRewardData]   = useState(null)
  const [floatingXP, setFloatingXP]   = useState([])
  const [floatingGold, setFloatingGold] = useState([])
  const xpIdRef   = useRef(0)
  const goldIdRef = useRef(0)

  const updateCharacter = useCallback((char) => setCharacter(char), [])

  const triggerLumi = useCallback((msg, state = 'happy', durationMs = 4000) => {
    setLumiMessage(msg)
    setLumiState(state)
    setTimeout(() => {
      setLumiState('idle')
      setLumiMessage("Your next quest awaits! ✨")
    }, durationMs)
  }, [])

  const triggerLevelUp = useCallback((data) => {
    setLevelUpData(data)
    setShowLevelUp(true)
    triggerLumi(`🎉 LEVEL ${data.newLevel}! You're incredible!`, 'victory', 8000)
  }, [triggerLumi])

  const triggerReward = useCallback((data) => {
    setRewardData(data)
    setShowReward(true)
    triggerLumi("Quest complete! Amazing work! ✨", 'celebrating', 5000)
  }, [triggerLumi])

  const spawnFloatingXP = useCallback((amount, x = 50, y = 50) => {
    const id = ++xpIdRef.current
    setFloatingXP(prev => [...prev, { id, amount, x, y }])
    setTimeout(() => setFloatingXP(prev => prev.filter(f => f.id !== id)), 2000)
  }, [])

  const spawnFloatingGold = useCallback((amount, x = 60, y = 50) => {
    const id = ++goldIdRef.current
    setFloatingGold(prev => [...prev, { id, amount, x, y }])
    setTimeout(() => setFloatingGold(prev => prev.filter(f => f.id !== id)), 2000)
  }, [])

  const closeLevelUp = useCallback(() => { setShowLevelUp(false); setLevelUpData(null) }, [])
  const closeReward  = useCallback(() => { setShowReward(false);  setRewardData(null)  }, [])

  return (
    <GameContext.Provider value={{
      character, updateCharacter,
      lumiMessage, lumiState,
      triggerLumi, triggerLevelUp, triggerReward,
      showLevelUp, levelUpData, closeLevelUp,
      showReward,  rewardData,  closeReward,
      floatingXP, floatingGold,
      spawnFloatingXP, spawnFloatingGold,
    }}>
      {children}
    </GameContext.Provider>
  )
}

export const useGame = () => {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}

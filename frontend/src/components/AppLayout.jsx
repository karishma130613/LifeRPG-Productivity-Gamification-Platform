import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import StarlightBackground from './StarlightBackground'
import LevelUpModal from './LevelUpModal'
import RewardModal from './RewardModal'
import FloatingRewards from './FloatingRewards'
import { useGame } from '../context/GameContext'

export default function AppLayout() {
  const { showLevelUp, showReward } = useGame()
  const location = useLocation()

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: 'var(--theme-bg)' }}>
      <StarlightBackground />
      
      <div className="relative z-10 flex min-h-screen">
        <Sidebar />
        
        <main className="app-main flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="app-page flex-1 p-4 lg:p-6 xl:p-8"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <BottomNav />
      <FloatingRewards />
      {showLevelUp && <LevelUpModal />}
      {showReward  && <RewardModal />}
    </div>
  )
}

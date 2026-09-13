import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { GameProvider } from './context/GameContext'
import { ThemeProvider } from './context/ThemeContext'
import AppLayout from './components/AppLayout'

// Pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import QuestsPage from './pages/QuestsPage'
import QuestMapPage from './pages/QuestMapPage'
import CharacterPage from './pages/CharacterPage'
import WorldPage from './pages/WorldPage'
import BossPage from './pages/BossPage'
import ShopPage from './pages/ShopPage'
import InventoryPage from './pages/InventoryPage'
import AchievementsPage from './pages/AchievementsPage'
import ProgressPage from './pages/ProgressPage'
import SettingsPage from './pages/SettingsPage'
import GameRealmPage from './pages/GameRealmPage'

// Protected Route Guard
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center text-gold">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-title text-sm tracking-widest uppercase">Connecting to Realm...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

// Public-only Route Guard (redirects logged in users to /dashboard)
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return null
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <GameProvider>
        <Routes>
          {/* Public Landing */}
          <Route path="/" element={<LandingPage />} />

          {/* Public Auth Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />

          {/* Protected In-Game Routes */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/quests" element={<QuestsPage />} />
            <Route path="/game-realm" element={<GameRealmPage />} />
            <Route path="/games" element={<Navigate to="/game-realm" replace />} />
            <Route path="/quest-map" element={<QuestMapPage />} />
            <Route path="/character" element={<CharacterPage />} />
            <Route path="/world" element={<WorldPage />} />
            <Route path="/boss" element={<BossPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </GameProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

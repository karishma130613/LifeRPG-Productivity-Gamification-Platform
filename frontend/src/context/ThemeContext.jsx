import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const ThemeContext = createContext(null)

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('liferp-theme') || 'night'
  })

  // Sync to html attribute for CSS selectors
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('liferp-theme', theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setThemeState(prev => (prev === 'night' ? 'day' : 'night'))
  }, [])

  const isNight = theme === 'night'
  const isDay   = theme === 'day'

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isNight, isDay }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}

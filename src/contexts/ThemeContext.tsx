import React, { createContext, useContext, useState, useEffect } from 'react'

interface ThemeContextType {
  isDarkMode: boolean
  toggleDarkMode: () => void
  setIsDarkMode: (isDark: boolean) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to dark mode
  const [isDarkMode, setIsDarkMode] = useState(true)

  // Initialize theme from localStorage or default to dark
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      const isDark = savedTheme === 'dark'
      setIsDarkMode(isDark)
    } else {
      // Default to dark mode
      setIsDarkMode(true)
      localStorage.setItem('theme', 'dark')
    }
  }, [])

  // Apply theme to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    } else {
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
    }
    
    // Save to localStorage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, setIsDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

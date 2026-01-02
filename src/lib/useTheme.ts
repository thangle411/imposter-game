import { useEffect, useState } from 'react'

const THEME_STORAGE_KEY = 'imposter-game-theme'

type Theme = 'light' | 'dark'

function getStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') {
      return stored
    }
  } catch (error) {
    console.error('Error reading theme from localStorage:', error)
  }
  return null
}

function getSystemTheme(): Theme {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return 'light'
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

// Apply theme immediately on module load to prevent flash
if (typeof document !== 'undefined') {
  const stored = getStoredTheme()
  const initialTheme = stored || getSystemTheme()
  applyTheme(initialTheme)
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = getStoredTheme()
    if (stored) {
      return stored
    }
    return getSystemTheme()
  })

  useEffect(() => {
    applyTheme(theme)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch (error) {
      console.error('Error saving theme to localStorage:', error)
    }
  }, [theme])

  useEffect(() => {
    // Listen for system theme changes
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e: MediaQueryListEvent) => {
        const stored = getStoredTheme()
        if (!stored) {
          setTheme(e.matches ? 'dark' : 'light')
        }
      }
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return { theme, toggleTheme }
}


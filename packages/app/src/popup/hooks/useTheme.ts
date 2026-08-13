import { useState } from 'react'
import { Storage } from '@luban/wallet-storage'
import { LOCAL_THEME } from '../configs/constant'

export type Theme = 'Light' | 'Dark'
export type ThemeData = ReturnType<typeof useTheme>

export default function useTheme() {
  const [theme, setCurrentTheme] = useState<Theme>('Light')

  const setTheme = (value: Theme) => {
    setCurrentTheme(value)
    document.documentElement.className = value.toLowerCase()
  }

  const setAndCacheTheme = (value: Theme) => {
    Storage.getInstance('local').set(LOCAL_THEME, value)
    setCurrentTheme(value)

    document.documentElement.className = value.toLowerCase()
  }

  return {
    theme,
    setTheme,
    setAndCacheTheme,
  }
}

import { createContext } from 'react'
import type { ThemeData } from '../hooks/useTheme'

export const ThemeContext = createContext<ThemeData | null>(null)

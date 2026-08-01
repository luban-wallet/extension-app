import { createContext } from 'react'
import type { TokenData } from '../hooks/useTokens'

export const TokenContext = createContext<TokenData | null>(null)

import { createContext } from 'react'
import type { WalletData } from '../hooks/useWallet'

export const WalletContext = createContext<WalletData | null>(null)

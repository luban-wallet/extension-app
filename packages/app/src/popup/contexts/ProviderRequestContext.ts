import { createContext } from 'react'
import type { ProviderRequestData } from '../hooks/usePR'

export const ProviderRequestContext = createContext<ProviderRequestData | null>(null)

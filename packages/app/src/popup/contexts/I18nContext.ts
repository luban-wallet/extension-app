import { createContext } from 'react'
import type { I18nData } from '../hooks/useI18N'

export const I18nContext = createContext<I18nData | null>(null)

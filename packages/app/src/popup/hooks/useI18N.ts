import { useState } from 'react'
import { Storage } from '@luban/wallet-storage'
import { LOCAL_LANG } from '../configs/constant'
import { languages } from '../i18n/config'

export type I18nData = ReturnType<typeof useI18n>

export default function useI18n() {
  const [lang, setLang] = useState<string>('en')

  const t = (key: string, params: Record<string, string> | null = null) => {
    if(languages[lang] !== undefined) {
      let value = languages[lang][key] ?? ''
      if(params !== null) {
        for(const p in params) {
          value = value.replace('{' + p + '}', params[p])
        }
      }
      return value
    }

    return key
  }

  const setAndCacheLanguage = async (key: string) => {
    try {
      await Storage.getInstance('local').set(LOCAL_LANG, key)
      setLang(key)
    } catch(e) {
      console.error(e)
    }
  }

  const setLanguage = (key: string) => {
    setLang(key)
  }

  return {
    lang,
    setLanguage,
    setAndCacheLanguage,
    t
  }
}

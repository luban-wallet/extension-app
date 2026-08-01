import { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router'
import DB from '@lubankit/indexeddb'
import { Storage } from '@luban/wallet-storage'
import routes from './router/index'
import useI18n from './hooks/useI18N'
import { I18nContext } from './contexts/I18nContext'
import Toast from './components/toast'
import SplashScreen from './components/splash-screen'
import { LOCAL_CURRENT_ACCOUNT, LOCAL_CURRENT_CHAIN, LOCAL_LANG, LOCAL_THEME, WALLET_DB, WALLET_DB_VER } from './configs/constant'
import { defaultNetworks, type INetwork } from './configs/network'
import type { IAccount } from './configs/account'
import { TokenContext } from './contexts/TokenContext'
import useTokens from './hooks/useTokens'
import { ThemeContext } from './contexts/ThemeContext'
import useTheme, { type Theme } from './hooks/useTheme'
import { ProviderRequestContext } from './contexts/ProviderRequestContext'
import usePR from './hooks/usePR'
import { log } from './utils/debug'
import useWallet from './hooks/useWallet'
import { WalletContext } from './contexts/WalletContext'

import './style.css'

const TAG = '[PopupMain]'

function Wrapper() {
  const [loading, setLoading] = useState(true)
  const i18nData = useI18n()
  const themeData = useTheme()
  const walletData = useWallet()
  const tokenData = useTokens()
  const providerRequestData = usePR()

  useEffect(() => {
    init()
  }, [])

  const initDB = async () => {
    let versionChanged = false

    DB.onupgradeneeded = (db: IDBDatabase) => {
      versionChanged = true
      let os: IDBObjectStore

      if (!db.objectStoreNames.contains('prev_chain_account')) {
        os = db.createObjectStore('prev_chain_account', { keyPath: 'id', autoIncrement: true })
        os.createIndex('chainType', 'chainType', { unique: false })
      }
      if (!db.objectStoreNames.contains('accounts')) {
        os = db.createObjectStore('accounts', { keyPath: 'id', autoIncrement: true })
        os.createIndex('chainType', 'chainType', { unique: false })
      }
      if (!db.objectStoreNames.contains('networks')) {
        os = db.createObjectStore('networks', { keyPath: 'id', autoIncrement: true })
        os.createIndex('chainId', 'chainId', { unique: false })
      }
      if (!db.objectStoreNames.contains('tokens')) {
        os = db.createObjectStore('tokens', { keyPath: 'id', autoIncrement: true })
        os.createIndex('chainId', 'chainId', { unique: false })
      }
      if (!db.objectStoreNames.contains('connections')) {
        db.createObjectStore('connections', { keyPath: 'id', autoIncrement: true })
      }

      log(TAG, 'init db success')
    }

    const db = new DB({ dbName: WALLET_DB, version: WALLET_DB_VER })
    const cmd = await db.getCommand()
    if (versionChanged) {
      // default chain
      await Storage.getInstance('local').set(LOCAL_CURRENT_CHAIN, defaultNetworks[0])

      // clear accounts
      await cmd.clear('prev_chain_account')
      await cmd.clear('accounts')
      await cmd.clear('networks')
      await cmd.clear('tokens')
      // insert default networks
      await cmd.batchAdd('networks', defaultNetworks)

      log(TAG, 'db version changed, init default data')
    }
    db.close()
  }

  const getLang = async (): Promise<string> => {
    const lang = await Storage.getInstance<string>('local').get(LOCAL_LANG)
    return lang === null ? '' : lang
  }

  const getTheme = async (): Promise<string> => {
    const theme = await Storage.getInstance<string>('local').get(LOCAL_THEME)
    return theme === null ? '' : theme
  }

  const getAccount = async (): Promise<IAccount | null> => {
    const account = await Storage.getInstance<IAccount>('local').get(LOCAL_CURRENT_ACCOUNT)
    return account
  }

  const getNetwork = async (): Promise<INetwork | null> => {
    const network = await Storage.getInstance<INetwork>('local').get(LOCAL_CURRENT_CHAIN)
    return network
  }

  const init = async () => {
    try {
      // db
      await initDB()

      const lang = await getLang()
      const theme = await getTheme()
      const account = await getAccount()
      const network = await getNetwork()

      // Setting data from cache
      if (lang !== '') {
        i18nData.setLanguage(lang)
      }
      if (theme !== '') {
        themeData.setTheme(theme as Theme)
      }
      if (account !== null) {
        walletData.setCurrentAccount(account)
      }
      if (network !== null) {
        walletData.setCurrentNetwork(network)
      }

      setLoading(false)
    } catch (e) {
      console.error('init db error: ', e)
    }
  }

  log(TAG, 'root page render', loading)

  if (loading) {
    return (
      <SplashScreen />
    )
  }

  return (
    // <React.StrictMode>
    <ProviderRequestContext.Provider value={providerRequestData}>
      <TokenContext.Provider value={tokenData}>
        <I18nContext.Provider value={i18nData}>
          <ThemeContext.Provider value={themeData}>
            <WalletContext.Provider value={walletData}>
              <RouterProvider router={routes} />
              <Toast />
            </WalletContext.Provider>
          </ThemeContext.Provider>
        </I18nContext.Provider>
      </TokenContext.Provider>
    </ProviderRequestContext.Provider>
    // </React.StrictMode>,
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Wrapper />
)

import { Suspense, useEffect } from 'react'
import { Outlet } from 'react-router'
import SplashScreen from './components/splash-screen'
import { LOCAL_LAST_ACTIVE_MS } from './configs/constant'
import { Storage } from '@luban/wallet-storage'
import { log } from './utils/debug'

const TAG = '[Layout]'
export default function Layout() {
  const updateActiveTime = async () => {
    try {
      const now = BigInt(Date.now()).toString()
      await Storage.getInstance('local').set(LOCAL_LAST_ACTIVE_MS, now)
    } catch(e) {
      log(TAG, e)
    }
  }

  useEffect(() => {
    updateActiveTime()
  }, [])

  return (
    <Suspense fallback={<SplashScreen />}>
      <Outlet />
    </Suspense>
  )
}

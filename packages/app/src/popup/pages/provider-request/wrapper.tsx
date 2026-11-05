import { Suspense, useContext, useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'
import { Storage } from '@luban/wallet-storage'
import SplashScreen from '../../components/splash-screen'
import type { ProviderRequest } from '../../hooks/usePR'
import MsgHelper from '../../helpers/MsgHelper'
import { log } from '../../utils/debug'
import { ProviderRequestContext } from '../../contexts/ProviderRequestContext'
import { LOCAL_LAST_ACTIVE_MS, MEM_PWD } from '../../configs/constant'

const TAG = '[ProviderRequestWrapper]'

export default function Wrapper() {
  const [loading, setLoading] = useState(true)
  const { request } = useContext(ProviderRequestContext)!
  const nav = useNavigate()
  const loc = useLocation()

  const updateActiveTime = async () => {
    try {
      const now = BigInt(Date.now()).toString()
      await Storage.getInstance('local').set(LOCAL_LAST_ACTIVE_MS, now)
    } catch(e) {
      log(TAG, e)
    }
  }

  const grabData = async () => {
    try {
      const pwd = await MsgHelper.memGet(MEM_PWD)
      if(!pwd) {
        nav('/unlock?url=' + loc.pathname)
        return
      }

      const data = await MsgHelper.providerRequestGrabData<ProviderRequest>()
      log(TAG, 'Wrapper grabData: ', data)
      request.current = data
      setLoading(false)
    } catch(e) {
      log(TAG, e)
    }
  }

  useEffect(() => {
    updateActiveTime()
    grabData()
  }, [])

  if(loading) {
    return <SplashScreen />
  }

  return (
    <Suspense fallback={<SplashScreen />}>
      <Outlet />
    </Suspense>
  )
}

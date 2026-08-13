import { Suspense, useContext, useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'
import SplashScreen from '../../components/splash-screen'
import type { ProviderRequest } from '../../hooks/usePR'
import MsgHelper from '../../helpers/MsgHelper'
import { log } from '../../utils/debug'
import { ProviderRequestContext } from '../../contexts/ProviderRequestContext'
import { MEM_PWD } from '../../configs/constant'

const TAG = '[ProviderRequestWrapper]'

export default function Wrapper() {
  const [loading, setLoading] = useState(true)
  const { request } = useContext(ProviderRequestContext)!
  const nav = useNavigate()
  const loc = useLocation()

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
      console.error(e)
    }
  }

  useEffect(() => {
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

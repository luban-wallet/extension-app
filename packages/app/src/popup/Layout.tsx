import { Suspense } from 'react'
import { Outlet } from 'react-router'
import SplashScreen from './components/splash-screen'

export default function App() {
  return (
    <Suspense fallback={<SplashScreen />}>
      <Outlet />
    </Suspense>
  )
}

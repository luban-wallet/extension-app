import { lazy, Suspense } from 'react'
import { createHashRouter } from 'react-router'
import Layout from '../Layout'
import Wrapper from '../pages/provider-request/wrapper'

const Init = lazy(() => import('../pages/init'))
const CreatePassword = lazy(() => import('../pages/create-wallet/index'))
const Home = lazy(() => import('../pages/home/index'))
const CreateGenerateType = lazy(() => import('../pages/create-wallet/type'))
const CreateAutoGenerate = lazy(() => import('../pages/create-wallet/auto'))
const CreateManualGenerate = lazy(() => import('../pages/create-wallet/manual'))
const CreateDone = lazy(() => import('../pages/create-wallet/done'))
const TokenDetail = lazy(() => import('../pages/home/token-detail'))
const SendCoin = lazy(() => import('../pages/home/send-coin'))
const SendCoinSign = lazy(() => import('../pages/home/send-coin-sign'))
const Receive = lazy(() => import('../pages/home/receive'))
const Settings = lazy(() => import('../pages/home/settings'))
const TokenAdd = lazy(() => import('../pages/home/token-add'))
const AccountAdd = lazy(() => import('../pages/home/account-add'))
const Backup = lazy(() => import('../pages/home/settings-backup'))
const BackupDetail = lazy(() => import('../pages/home/settings-backup-detail'))
const Unlock = lazy(() => import('../pages/unlock'))
const SendToken = lazy(() => import('../pages/home/send-token'))
const SendTokenSign = lazy(() => import('../pages/home/send-token-sign'))
const SettingsAccount = lazy(() => import('../pages/home/settings-account'))
const SettingsNetwork = lazy(() => import('../pages/home/settings-network'))
const SettingsLanguage = lazy(() => import('../pages/home/settings-language'))
const SettingsTheme = lazy(() => import('../pages/home/settings-theme'))
const ForgetPassword = lazy(() => import('../pages/forget-password'))
const ImportWallet = lazy(() => import('../pages/import-wallet'))
const Tool = lazy(() => import('../pages/tool'))
const SendDone = lazy(() => import('../pages/home/send-done'))
const Activities = lazy(() => import('../pages/home/activities'))
const NetworkAdd = lazy(() => import('../pages/home/network-add'))
const SettingsAbout = lazy(() => import('../pages/home/settings-about'))
const ProviderAccount = lazy(() => import('../pages/provider-request/account'))
const ProviderSignMessage = lazy(() => import('../pages/provider-request/sign-message'))
const SettingsConnections = lazy(() => import('../pages/home/settings-connections'))
const ProviderSwitchChain = lazy(() => import('../pages/provider-request/switch-chain'))
const ProviderSignTypedData = lazy(() => import('../pages/provider-request/sign-typeddata'))
const ProviderSendTransaction = lazy(() => import('../pages/provider-request/send-transaction'))

const routes = createHashRouter([
  {
    path: "/",
    element: <Suspense><Init /></Suspense>,
  },
  {
    path: '/tool',
    element: <Suspense><Tool /></Suspense>,
  },
  {
    path: "/unlock",
    element: <Suspense><Unlock /></Suspense>,
  },
  {
    path: "/forget-password",
    element: <Suspense><ForgetPassword /></Suspense>,
  },
  {
    path: '/import-wallet',
    element: <Suspense><ImportWallet /></Suspense>,
  },
  {
    path: '/create-wallet',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <CreatePassword />
      },
      {
        path: "type",
        element: <CreateGenerateType />
      },
      {
        path: "auto",
        element: <CreateAutoGenerate />
      },
      {
        path: "manual",
        element: <CreateManualGenerate />
      },
      {
        path: 'done',
        element: <CreateDone />
      }
    ]
  },
  {
    path: "/home",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'receive',
        element: <Receive />
      },
      {
        path: 'activities',
        element: <Activities />
      },
      {
        path: "send-coin",
        element: <SendCoin />
      },
      {
        path: "send-coin-sign",
        element: <SendCoinSign />
      },
      {
        path: 'send-token',
        element: <SendToken />
      },
      {
        path: 'send-token-sign',
        element: <SendTokenSign />
      },
      {
        path: 'send-done',
        element: <SendDone />
      },
      {
        path: "token-detail/:id",
        element: <TokenDetail />
      },
      {
        path: 'token-add',
        element: <TokenAdd />
      },
      {
        path: 'account-add',
        element: <AccountAdd />
      },
      {
        path: 'network-add',
        element: <NetworkAdd />
      },
      {
        path: 'settings',
        children: [
          {
            index: true,
            element: <Settings />
          },
          {
            path: 'account',
            element: <SettingsAccount />
          },
          {
            path: 'network',
            element: <SettingsNetwork />
          },
          {
            path: 'connections',
            element: <SettingsConnections />
          },
          {
            path: 'language',
            element: <SettingsLanguage />
          },
          {
            path: 'theme',
            element: <SettingsTheme />
          },
          {
            path: 'backup',
            children: [
              { index: true, element: <Backup /> },
              { path: 'detail', element: <BackupDetail /> },
            ]
          },
          {
            path: 'about',
            element: <SettingsAbout />
          }
        ]
      }
    ]
  },
  {
    path: "/provider-request",
    element: <Wrapper />,
    children: [
      {
        path: 'account',
        element: <ProviderAccount />
      },
      {
        path: 'sign-message',
        element: <ProviderSignMessage />
      },
      {
        path: 'sign-typeddata',
        element: <ProviderSignTypedData />
      },
      {
        path: 'switch-chain',
        element: <ProviderSwitchChain />
      },
      {
        path: 'send-transaction',
        element: <ProviderSendTransaction />
      }
    ]
  }
])

export default routes

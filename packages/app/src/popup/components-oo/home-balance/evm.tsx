import type { IAccount } from "../../configs/account"
import type { INetwork } from "../../configs/network"
import { useContext, useEffect, useState } from "react"
import Skeleton from "../../components/skeleton"
import { TokenContext } from "../../contexts/TokenContext"
import { log } from "../../utils/debug"
import { WalletContext } from "../../contexts/WalletContext"
import ServiceFactory from "../../services/ServiceFactory"
import { toMaximalUnit } from "../../utils/util"
import SimpleEvent from "@lubankit/utils/SimpleEvent"
import { EVENT_REFRESH_BALANCE } from "../../configs/constant"

const wrapper = {
  display: 'grid',
  placeItems: 'center',
  height: '40px',
  overflowY: 'hidden' as const,
}
const balanceInner = {
  display: 'flex',
  columnGap: '8px',
  fontSize: '32px',
  fontWeight: '600',
  width: 'max-content'
}

const TAG = '[Panel_Balance_EVM]'

export default function Evm() {
  const [loading, setLoading] = useState(false)
  const { currentAccount, currentNetwork } = useContext(WalletContext)!
  const { getCachedCoinBalance, setCachedCoinBalance } = useContext(TokenContext)!
  const [balance, setBalance] = useState('0')

  const init = (network: INetwork | null, account: IAccount | null) => {
    if(network === null || account === null) {
      return
    }

    const cache = getCachedCoinBalance(network.chainId, account.address)
    if(cache === undefined) {
      getBalance({
        network,
        account,
      })
      return
    }

    log(TAG, 'use cached coin balance')
    setBalance(cache)
  }

  const getBalance = async (e: {network: INetwork, account: IAccount}) => {
    const { network, account } = e
    if(network === null || account === null) {
      return
    }

    try {
      setLoading(true)
      const service = ServiceFactory.getService(network.chainType)
      const coin = await service.getCoinBalance(network.rpc, account.address)
      setCachedCoinBalance(network.chainId, account.address, coin.available)
      setBalance(coin.available)
      setLoading(false)
    } catch(e) {
      console.error('get balance error', e)
    }
  }

  useEffect(() => {
    SimpleEvent.getInstance().on(EVENT_REFRESH_BALANCE, getBalance)
    return () => {
      SimpleEvent.getInstance().off(EVENT_REFRESH_BALANCE, getBalance)
    }
  }, [])

  useEffect(() => {
    init(currentNetwork, currentAccount)
  }, [ currentNetwork?.chainId, currentAccount?.address ])

  return (
    <h2 style={wrapper}>
      {
        loading ? (
          <Skeleton style={{height: '28px', width: '120px'}} />
        ) : (
        <div style={balanceInner}>
          <span>{toMaximalUnit(balance, currentNetwork?.chainType)}</span>
          <span>{currentNetwork?.symbol}</span>
        </div>
        )
      }
    </h2>
  )
}

import { useCallback, useContext, useEffect, useState } from 'react'
import { Link } from 'react-router'
import ColorIcon from '../color-icon'
import type { IToken } from '../../configs/token'
import { formatUnits } from '../../utils/util'
import { TokenContext } from '../../contexts/TokenContext'
import Skeleton from '../skeleton'
import SimpleEvent from '@lubankit/utils/SimpleEvent'
import { EVENT_REFRESH_BALANCE } from '../../configs/constant'
import type { INetwork } from '../../configs/network'
import type { IAccount } from '../../configs/account'
import ServiceFactory from '../../services/ServiceFactory'
import { log } from '../../utils/debug'
import { WalletContext } from '../../contexts/WalletContext'

import css from './index.module.css'

const TAG = '[AssetItem]'

export default function AssetItem(props: {token: IToken}) {
  const [loading, setLoading] = useState(true)
  const { currentAccount, currentNetwork } = useContext(WalletContext)!
  const { getCachedBalance, setCachedBalance } = useContext(TokenContext)!
  const [balance, setBalance] = useState<string>('')
  const { token } = props

  useEffect(() => {
    init()
  }, [currentAccount?.address])

  useEffect(() => {
    SimpleEvent.getInstance().off(EVENT_REFRESH_BALANCE, fetchBalance)
    SimpleEvent.getInstance().on(EVENT_REFRESH_BALANCE, fetchBalance)
    return () => {
      SimpleEvent.getInstance().off(EVENT_REFRESH_BALANCE, fetchBalance)
    }
  }, [])

  const init = async () => {
    if(currentAccount === null) {
      return
    }

    const cached = getCachedBalance(token.id!, currentAccount.address)
    if(cached !== undefined) {
      log(TAG, 'use cached balance')
      setBalance(cached)
      setLoading(false)
      return
    }

    fetchBalance({network: currentNetwork, account: currentAccount})
  }

  const fetchBalance = useCallback(async (e: {network: INetwork | null, account: IAccount | null}) => {
    const { network, account } = e
    if(network === null || account === null) {
      return
    }

    try {
      setLoading(true)
      const service = ServiceFactory.getService(network.chainType)
      const balance = await service.getTokenBalance(network.rpc, token.contract, account.address)
      setCachedBalance(token.id!, account.address, balance)
      setBalance(balance)
      setLoading(false)
    } catch(e) {
      console.error(e)
    }
  }, [token.id])

  return (
    <Link className={css.wrapper} to={`/home/token-detail/${token.id}`}>
      <ColorIcon size={44} font={20} name={token.symbol} />
      <div className={css.main} >
        <div className={css.name}>{token.symbol}</div>
        <div className={css.amount}>
          {
            loading
              ? <Skeleton />
              : <span>{formatUnits(balance ?? '', Number(token.decimals))} <span>{token.symbol}</span></span>
          }
        </div>
      </div>
    </Link>
  )
}

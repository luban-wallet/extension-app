import { useContext, useEffect, useState } from "react"
import { WalletContext } from "../../contexts/WalletContext"
import SimpleEvent from "@lubankit/utils/SimpleEvent"
import { EVENT_REFRESH_BALANCE } from "../../configs/constant"
import type { INetwork } from "../../configs/network"
import type { IAccount } from "../../configs/account"
import ServiceFactory from "../../services/ServiceFactory"
import Skeleton from "../../components/skeleton"
import { toMaximalUnit } from "../../utils/util"
import Tooltip from "../../components/tooltip"
import Row from "../../components/row"
import { I18nContext } from "../../contexts/I18nContext"

const wrapper = {
  display: 'grid',
  placeItems: 'center',
  height: '40px',
  overflowX: 'auto' as const,
  overflowY: 'hidden' as const,
}
const balanceInner = {
  display: 'flex',
  columnGap: '8px',
  fontSize: '32px',
  fontWeight: '600',
  width: 'max-content',
}

export default function Btc() {
  const [loading, setLoading] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const { currentAccount, currentNetwork } = useContext(WalletContext)!
  const [balance, setBalance] = useState('0')
  const [unconfirm, setUnconfirm] = useState('0')
  const { t } = useContext(I18nContext)!

  const init = (network: INetwork | null, account: IAccount | null) => {
    if(network === null || account === null) {
      return
    }

    getBalance({
      network,
      account,
    })
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

      setBalance(coin.available)
      setUnconfirm(coin.unconfirmed)
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
    <div
      style={{position: 'relative'}}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
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

        {
          showTooltip ? (
            <Tooltip>
              <div style={{display: 'flex', flexDirection: 'column', rowGap: '12px'}}>
                <Row label={t('page.home.balance.tooltip.available')}>
                  {toMaximalUnit(balance, currentNetwork?.chainType)} BTC
                </Row>
                <Row label={t('page.home.balance.tooltip.unconfirmed')}>
                  {toMaximalUnit(unconfirm, currentNetwork?.chainType)} BTC
                </Row>
              </div>
            </Tooltip>
          ) : null
        }
      </h2>
    </div>
  )
}

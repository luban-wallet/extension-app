import { useContext, useEffect, useState } from "react"
import { WalletContext } from "../../contexts/WalletContext"
import { toMaximalUnit, toMinimalUnit } from "../../utils/util"
import type { IProps } from './type'
import Loading from "../../components/loading"
import ServiceFactory from "../../services/ServiceFactory"
import Row from "../../components/row"
import Button from "../../components/button"
import WalletFactory from "../../wallets/WalletFactory"
import { I18nContext } from "../../contexts/I18nContext"
import { log } from "../../utils/debug"
import type { IBitcoinWallet } from "../../wallets/IWallet"

const calculateTotalFee = (props: { feeUnitPrice: string, gasLimit: string }) => {
  const { feeUnitPrice, gasLimit } = props
  return BigInt(feeUnitPrice) * BigInt(gasLimit)
}

const TAG = '[BTC_TX_CONFIRM]'
export default function Btc(props: IProps) {
  const { to, amount, symbol, feeUnitPrice } = props
  const [loading, setLoading] = useState(true)
  const { currentNetwork, txMeta } = useContext(WalletContext)!
  const [gasLimit, setGasLimit] = useState('0')
  const { t } = useContext(I18nContext)!

  const init = async () => {
    if(currentNetwork === null) {
      return
    }

    try {
      setLoading(true)
      const unspent = txMeta.current?.unspent ?? []
      const service = ServiceFactory.getService(currentNetwork)
      const amountSats = toMinimalUnit(amount, currentNetwork.chainType)
      const wallet = await WalletFactory.getLazyWallet(currentNetwork) as IBitcoinWallet
      const utxos = await wallet.selectUtxos(feeUnitPrice, amountSats.toString(), unspent)
      const quantity = await service.estimateGas(currentNetwork.rpc, [{
        input: utxos.selected.length,
        output: utxos.needChange ? 2 : 1
      }])

      setGasLimit(quantity)
    } catch(e) {
      log(TAG, e)
    } finally {
      setLoading(false)
    }
  }

  const send = () => {
    const totalFee = calculateTotalFee({ feeUnitPrice, gasLimit })
    props.onConfirm(totalFee.toString(), gasLimit)
  }

  useEffect(() => {
    init()
  }, [currentNetwork])

  if (currentNetwork === null) {
    return null
  }
  if(loading) {
    return (
      <div style={{height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Loading size={40} />
      </div>
    )
  }

  const fee = calculateTotalFee({ feeUnitPrice, gasLimit })
  const result = toMaximalUnit(fee.toString(), currentNetwork.chainType)
  const formula = `${feeUnitPrice} sat/VB * ${gasLimit} VB`

  return (
    <div style={{minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
      <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
        <Row label={t('page.send.tx.confirm.to')}>
          <p>{to}</p>
        </Row>
        <Row label={t('page.send.tx.confirm.sendamount')}>
          <p>{amount} {symbol}</p>
        </Row>
        <Row label={t('page.send.tx.confirm.txfee')}>
          <p>{formula}</p>
          <p>≈ {result} {currentNetwork.symbol}</p>
        </Row>
      </div>

      <div>
        <Button disabled={loading} variant="primary" onClick={send}>{t('page.send.sign.btn.send')}</Button>
      </div>
    </div>
  )
}

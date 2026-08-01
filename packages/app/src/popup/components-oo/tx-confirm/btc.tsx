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

export default function Btc(props: IProps) {
  const { to, amount, symbol, feeUnitPrice } = props
  const [loading, setLoading] = useState(true)
  const { currentNetwork, txMeta } = useContext(WalletContext)!
  const [gasLimit, setGasLimit] = useState('0')
  const { t } = useContext(I18nContext)!

  const calculateTotalFee = () => {
    return BigInt(feeUnitPrice) * BigInt(gasLimit)
  }

  const init = async () => {
    if(currentNetwork === null) {
      return
    }

    try {
      setLoading(true)
      const unspent = txMeta.current?.unspent ?? []
      const amountSats = toMinimalUnit(amount, currentNetwork.chainType)
      const wallet = await WalletFactory.getLazyWallet(currentNetwork.chainType)
      const utxos = await wallet.selectUtxos(feeUnitPrice, amountSats.toString(), unspent)
      const service = ServiceFactory.getService(currentNetwork.chainType)
      const quantity = await service.estimateGas(currentNetwork.rpc, [{
        input: utxos.selected.length,
        output: utxos.needChange ? 2 : 1
      }])

      setGasLimit(quantity)
    } catch(e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const send = () => {
    const totalFee = calculateTotalFee()
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

  const fee = calculateTotalFee()
  const result = toMaximalUnit(fee.toString(), currentNetwork.chainType) + ' ' + currentNetwork.symbol
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
          <p>≈ {result}</p>
          <p>{formula}</p>
        </Row>
      </div>

      <div>
        <Button disabled={loading} variant="primary" onClick={send}>Confirm</Button>
      </div>
    </div>
  )
}

import { useContext, useEffect, useState } from "react"
import { WalletContext } from "../../contexts/WalletContext"
import { toMaximalUnit } from "../../utils/util"
import type { IProps } from './type'
import Loading from "../../components/loading"
import ServiceFactory from "../../services/ServiceFactory"
import Row from "../../components/row"
import Button from "../../components/button"
import { I18nContext } from "../../contexts/I18nContext"
import { log } from "../../utils/debug"

const calculateTotalFee = (props: { balance: string, feeUnitPrice: string, feeQuantity: string }) => {
  const { balance, feeUnitPrice, feeQuantity } = props
  const fee = BigInt(feeUnitPrice) * BigInt(feeQuantity)
  const send = BigInt(balance) - fee

  return {
    fee,
    send
  }
}

const TAG = '[BTC_TX_SENDCOIN_ALL_CONFIRM]'
export default function Btc(props: IProps) {
  const { from, to, amount, symbol, feeUnitPrice } = props
  const { currentNetwork } = useContext(WalletContext)!
  const { t } = useContext(I18nContext)!
  const [loading, setLoading] = useState(true)
  const [feeQuantity, setFeeQuantity] = useState('0')

  const init = async () => {
    if(currentNetwork === null) {
      return
    }

    try {
      setLoading(true)
      const service = ServiceFactory.getService(currentNetwork)

      const list = await service.getUnspentList(currentNetwork.rpc, from)
      const quantity = await service.estimateGas(currentNetwork.rpc, [{
        input: list.length,
        output: 1
      }])
      setFeeQuantity(quantity)
    } catch(e) {
      log(TAG, e)
    } finally {
      setLoading(false)
    }
  }

  const send = () => {
    const fee = calculateTotalFee({ balance: amount, feeUnitPrice, feeQuantity })
    props.onConfirm({
      gasLimit: feeQuantity,
      transactionFee: fee.fee,
      canSendAmount: fee.send,
    })
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

  const fee = calculateTotalFee({ balance: amount, feeUnitPrice, feeQuantity })
  const feeResult = toMaximalUnit(fee.fee.toString(), currentNetwork.chainType)

  const amountResult = toMaximalUnit(amount, currentNetwork.chainType)
  const receiveResult = toMaximalUnit(fee.send.toString(), currentNetwork.chainType)
  const receiveFormula = 'Send Amount - Transaction Fee'

  return (
    <div style={{minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
      <div style={{display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '16px'}}>
        <Row label={t('page.send.tx.confirm.to')}>
          <p>{to}</p>
        </Row>
        <Row label={t('page.send.tx.confirm.sendamount')}>
          <p>{amountResult} {symbol}</p>
        </Row>
        <Row label={t('page.send.tx.confirm.txfee')}>
          <p>≈ {feeResult} {currentNetwork.symbol}</p>
        </Row>
        <Row label={t('page.send.txsendcoinall.confirm.receive')}>
          <p>{receiveFormula}</p>
          <p>≈ {receiveResult} {symbol}</p>
        </Row>
      </div>

      <div>
        <Button disabled={loading} variant="primary" onClick={send}>{t('page.send.sign.btn.send')}</Button>
      </div>
    </div>
  )
}

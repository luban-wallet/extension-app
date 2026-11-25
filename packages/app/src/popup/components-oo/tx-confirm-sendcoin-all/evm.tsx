import { useContext, useEffect, useState } from "react"
import { WalletContext } from "../../contexts/WalletContext"
import { formatUnits, toMaximalUnit } from "../../utils/util"
import type { IProps } from './type'
import Loading from "../../components/loading"
import ServiceFactory from "../../services/ServiceFactory"
import Row from "../../components/row"
import Button from "../../components/button"
import { I18nContext } from "../../contexts/I18nContext"
import { log } from "../../utils/debug"
import { ESTIMATE_GAS_VALUE } from "../../configs/constant"

const calculateTotalFee = (props: { balance: string, baseFee: string, feeUnitPrice: string, gasLimit: string }) => {
  const { balance, baseFee, feeUnitPrice, gasLimit } = props
  const fee = (BigInt(baseFee) + BigInt(feeUnitPrice)) * BigInt(gasLimit)
  const send = BigInt(balance) - fee

  return {
    fee,
    send
  }
}

const TAG = '[EVM_TX_SENDCOIN_ALL_CONFIRM]'
export default function Evm(props: IProps) {
  const { from, to, amount, symbol, baseFee, feeUnitPrice } = props
  const [loading, setLoading] = useState(true)
  const { currentNetwork } = useContext(WalletContext)!
  const [gasLimit, setGasLimit] = useState('0')
  const { t } = useContext(I18nContext)!

  const init = async () => {
    if(currentNetwork === null) {
      return
    }

    try {
      setLoading(true)
      const service = ServiceFactory.getService(currentNetwork)
      const payload: Record<string, string> = {
        from,
        to,
        value: ESTIMATE_GAS_VALUE,
      }

      const quantity = await service.estimateGas(currentNetwork.rpc, [payload])
      setGasLimit(BigInt(quantity).toString())
    } catch(e) {
      log(TAG, e)
    } finally {
      setLoading(false)
    }
  }

  const send = () => {
    const fee = calculateTotalFee({ balance: amount, baseFee, feeUnitPrice, gasLimit })
    props.onConfirm({
      gasLimit: gasLimit,
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

  const fee = calculateTotalFee({ balance: amount, baseFee, feeUnitPrice, gasLimit })
  const feeResult = toMaximalUnit(fee.fee.toString(), currentNetwork.chainType)
  const formula = `(${formatUnits(baseFee, 9)} gwei + ${formatUnits(feeUnitPrice, 9)} gwei) * ${BigInt(gasLimit).toString()}`

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
          <p>{formula}</p>
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

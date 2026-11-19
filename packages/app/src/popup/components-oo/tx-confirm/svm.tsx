import { useContext } from "react"
import { WalletContext } from "../../contexts/WalletContext"
import { toMaximalUnit } from "../../utils/util"
import type { IProps } from './type'
import Row from "../../components/row"
import Button from "../../components/button"
import { I18nContext } from "../../contexts/I18nContext"

// SVM use feeUnitPrice as priority fee
const calculateTotalFee = (props: { baseFee: string, feeUnitPrice: string }) => {
  const { baseFee, feeUnitPrice } = props
  return BigInt(baseFee) + BigInt(feeUnitPrice)
}

export default function Svm(props: IProps) {
  const { to, amount, symbol, baseFee, feeUnitPrice } = props
  const { currentNetwork } = useContext(WalletContext)!
  const { t } = useContext(I18nContext)!

  const send = () => {
    const totalFee = calculateTotalFee({ baseFee, feeUnitPrice })
    props.onConfirm(totalFee.toString(), '0')
  }

  if (currentNetwork === null) {
    return null
  }

  const fee = calculateTotalFee({ baseFee, feeUnitPrice })
  const result = toMaximalUnit(fee.toString(), currentNetwork.chainType)
  const formula = `${baseFee} + ${feeUnitPrice}`

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
          <p>≈ {result} {currentNetwork.symbol}</p>
          <p>{formula}</p>
        </Row>
      </div>

      <div>
        <Button variant="primary" onClick={send}>{t('page.send.sign.btn.send')}</Button>
      </div>
    </div>
  )
}

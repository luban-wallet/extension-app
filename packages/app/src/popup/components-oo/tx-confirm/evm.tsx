import { useContext, useEffect, useState } from "react"
import { WalletContext } from "../../contexts/WalletContext"
import { formatUnits, toMaximalUnit } from "../../utils/util"
import type { IProps } from './type'
import Loading from "../../components/loading"
import ServiceFactory from "../../services/ServiceFactory"
import Row from "../../components/row"
import Button from "../../components/button"
import WalletFactory from "../../wallets/WalletFactory"
import { I18nContext } from "../../contexts/I18nContext"
import { EVM_GAS_LIMIT_RATE } from "../../configs/constant"
import IconEdit from "../../components/icons/edit"
import Input from "../../components/input"

const advanced = {
  fontSize: '12px',
  cursor: 'pointer',
  width: 'auto',
  height: '20px',
  padding: '0px 8px'
}

export default function Evm(props: IProps) {
  const { isToken, from, to, amount, symbol, baseFee, feeUnitPrice } = props
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [loading, setLoading] = useState(true)
  const { currentNetwork } = useContext(WalletContext)!
  const [gasLimit, setGasLimit] = useState('0')
  const { t } = useContext(I18nContext)!

  const toggleAdvanced = () => {
    setShowAdvanced(!showAdvanced)
  }

  const calculateTotalFee = () => {
    return (BigInt(baseFee) + BigInt(feeUnitPrice)) * BigInt(gasLimit)
  }

  const init = async () => {
    if(currentNetwork === null) {
      return
    }

    try {
      setLoading(true)
      const service = ServiceFactory.getService(currentNetwork.chainType)
      const payload: Record<string, string> = {
        from,
        to,
        value: '0x0',
      }
      if(isToken) {
        const wallet = await WalletFactory.getLazyWallet(currentNetwork.chainType)
        payload.data = wallet.encodeTokenTransfer(to, '0')
      }

      let quantity = await service.estimateGas(currentNetwork.rpc, [payload])
      // Token transaction increase the gas limit
      if(isToken) {
        quantity = BigInt( Math.ceil(Number(quantity) * EVM_GAS_LIMIT_RATE) ).toString()
      }

      setGasLimit(BigInt(quantity).toString())
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
  const formula = `(${formatUnits(baseFee, 9)} gwei + ${formatUnits(feeUnitPrice, 9)} gwei) * ${BigInt(gasLimit).toString()}`

  return (
    <div style={{minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
      <div style={{display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '16px'}}>
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
        <Row label="">
          <Button
            variant="ghost"
            style={advanced}
            onClick={toggleAdvanced}
          >
            <IconEdit width={12} height={12} />
            <span>{t('page.send.text.showadvanced')}</span>
          </Button>
        </Row>
        {
          showAdvanced ? (
            <div>
              <Input
                value={gasLimit}
                suffix={<span>{t('page.send.tx.confirm.gaslimit')}</span>}
                onChange={(e) => setGasLimit(e.target.value)}
              />
            </div>
          ) : null
        }
      </div>

      <div>
        <Button disabled={loading} variant="primary" onClick={send}>{t('page.send.sign.btn.send')}</Button>
      </div>
    </div>
  )
}

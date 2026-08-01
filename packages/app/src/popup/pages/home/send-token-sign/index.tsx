import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import Button from "../../../components/button"
import Footer from "../../../components/footer"
import Pageheader from "../../../components/page-header"
import { I18nContext } from "../../../contexts/I18nContext"
import { formatUnits } from "../../../utils/util"
import Container from "../../../components/container"
import { MEM_PWD } from "../../../configs/constant"
import MsgHelper from "../../../helpers/MsgHelper"
import WalletFactory from "../../../wallets/WalletFactory"
import ServiceFactory from "../../../services/ServiceFactory"
import { log } from "../../../utils/debug"
import FromTo from "../../../components/from-to"
import FeeWithRefresh from "../../../components/fee/fee-with-refresh"
import { WalletContext } from "../../../contexts/WalletContext"
import { Form } from "../../../components/form"
import { ActionSheet, ActionSheetContent } from "../../../components/action-sheet"
import TxConfirm from "../../../components-oo/tx-confirm"

const TAG = '[SendTokenSign]'

export default function SendTokenSign() {
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(true)
  const { t } = useContext(I18nContext)!
  const { currentAccount, currentNetwork, tokenTxMeta } = useContext(WalletContext)!
  const [baseFee, setBaseFee] = useState('')
  const [feeUnitPrice, setFeeUnitPrice] = useState('')
  const [coinBalance, setCoinBalance] = useState('0')

  const nav = useNavigate()

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    if(currentNetwork === null || currentAccount === null) {
      return
    }

    try {
      setLoading(true)
      const service = ServiceFactory.getService(currentNetwork.chainType)
      const coin = await service.getCoinBalance(currentNetwork.rpc, currentAccount.address)
      setCoinBalance(coin.available)
    } catch(e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const changeFee = (fee: {baseFee: string, priorityFee: string}) => {
    log(TAG, 'fee changed: ', fee)
    setBaseFee(fee.baseFee)
    setFeeUnitPrice(fee.priorityFee)
    setLoading(false)
  }

  const handleCancel = () => {
    nav(-1)
  }

  const send = async () => {
    if(currentNetwork === null || tokenTxMeta.current === null) {
      return
    }

    setShowConfirm(true)
  }

  const handleSubmit = async (transactionFee: string, feeQuantity: string) => {
    if(tokenTxMeta.current === null || currentAccount === null || currentNetwork === null) {
      return
    }

    const pwd = await MsgHelper.memGet<string>(MEM_PWD)
    if(pwd === '') {
      toast.error(t('page.send.sign.msg.walleterror'))
      return
    }

    const tokenTx = tokenTxMeta.current

    // Check fee balance
    const totalFee = BigInt(transactionFee)
    if(totalFee > BigInt(coinBalance)) {
      toast.error(t('page.send.msg.insufficientbalance'))
      return
    }

    try {
      setLoading(true)

      const service = ServiceFactory.getService(currentNetwork.chainType)
      const wallet = await WalletFactory.getLazyWallet(currentNetwork.chainType)
      const tx = await wallet.prepareTokenTransaction(
        {
          ...tokenTx,
          gasLimit: feeQuantity,
          // Token transaction needs to set the contract address as the "to" field
          to: tokenTx.contract?.contract ?? ''
        },
        {
          baseFee,
          feeUnitPrice
        }
      )
      log(TAG, 'token tx: ', tx)

      const signWallet = await wallet.restore(pwd, currentAccount.index)
      const raw = await signWallet.signTransaction(tx)
      const hash = await service.sendRawTransaction(currentNetwork.rpc, [raw])

      nav('/home/send-done?hash=' + hash, {
        replace: true,
      })
    } catch(e) {
      toast.error((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Pageheader title={t('page.send.header')} />

      <Container footer>
        <Form>
          <FromTo
            sender={tokenTxMeta.current?.from ?? ''}
            recipient={tokenTxMeta.current?.to ?? ''}
            amount={formatUnits(tokenTxMeta.current?.value, Number(tokenTxMeta.current?.contract?.decimals ?? 0))}
            symbol={tokenTxMeta.current?.contract?.symbol ?? ''}
          />
          <FeeWithRefresh
            onFeeChange={changeFee}
          />
        </Form>
      </Container>

      <Footer>
        <Button onClick={handleCancel}>{t('page.send.sign.btn.cancel')}</Button>
        <Button disabled={loading} variant="primary" onClick={send}>{t('page.send.sign.btn.send')}</Button>
      </Footer>

      <ActionSheet open={showConfirm} onOpenChange={() => setShowConfirm(false)}>
        <ActionSheetContent loading={loading} title={'Confirm Transaction'}>
          <TxConfirm
            isToken
            from={tokenTxMeta.current?.from ?? ''}
            to={tokenTxMeta.current?.to ?? ''}
            amount={formatUnits(tokenTxMeta.current?.value, Number(tokenTxMeta.current?.contract?.decimals ?? 0))}
            symbol={tokenTxMeta.current?.contract?.symbol ?? ''}
            baseFee={baseFee}
            feeUnitPrice={feeUnitPrice}
            onConfirm={handleSubmit}
          />
        </ActionSheetContent>
      </ActionSheet>
    </>
  )
}

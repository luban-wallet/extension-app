import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import Button from "../../../components/button"
import Footer from "../../../components/footer"
import Pageheader from "../../../components/page-header"
import { I18nContext } from "../../../contexts/I18nContext"
import { toMaximalUnit, toMinimalUnit } from "../../../utils/util"
import Container from "../../../components/container"
import { MEM_PWD } from "../../../configs/constant"
import MsgHelper from "../../../helpers/MsgHelper"
import WalletFactory from "../../../wallets/WalletFactory"
import ServiceFactory from "../../../services/ServiceFactory"
import { log } from "../../../utils/debug"
import FromTo from "../../../components/from-to"
import FeeWithRefresh from "../../../components/fee/fee-with-refresh"
import { WalletContext } from "../../../contexts/WalletContext"
import { Form, FormItem } from "../../../components/form"
import Input from "../../../components/input"
import { ActionSheet, ActionSheetContent } from "../../../components/action-sheet"
import TxConfirm from "../../../components-oo/tx-confirm"

import css from './index.module.css'

const TAG = '[SendCoinSign]'

export default function SendCoinSign() {
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const { t } = useContext(I18nContext)!
  const { currentAccount, currentNetwork, txMeta } = useContext(WalletContext)!
  const [baseFee, setBaseFee] = useState('')
  const [feeUnitPrice, setFeeUnitPrice] = useState('')
  const [coinBalance, setCoinBalance] = useState('0')
  const [sendAmount, setSendAmount] = useState('')
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

  const changeFee = (fee: { baseFee: string, priorityFee: string }) => {
    log(TAG, 'fee changed: ', fee)
    setBaseFee(fee.baseFee)
    setFeeUnitPrice(fee.priorityFee)
  }

  const changeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSendAmount(e.target.value)
  }

  const handleCancel = () => {
    nav(-1)
  }

  const send = async () => {
    if(currentNetwork === null || txMeta.current === null) {
      return
    }

    setShowConfirm(true)
  }

  const handleSubmit = async (transactionFee: string, feeQuantity: string) => {
    if (currentAccount === null || currentNetwork === null || txMeta.current === null) {
      return
    }

    const pwd = await MsgHelper.memGet<string>(MEM_PWD)
    if (pwd === '') {
      toast.error(t('page.send.sign.msg.walleterror'))
      return
    }

    const coinTx = txMeta.current

    // Check balance
    const amount = toMinimalUnit(sendAmount, currentNetwork.chainType)
    const totalFee = BigInt(transactionFee)
    const balance = BigInt(coinBalance)
    if (amount + totalFee > balance) {
      toast.error(t('page.send.msg.insufficientbalance'))
      return
    }

    try {
      setLoading(true)
      const wallet = await WalletFactory.getLazyWallet(currentNetwork.chainType)
      const tx = await wallet.prepareCoinTransaction(
        {
          ...coinTx,
          value: amount.toString(),
          gasLimit: feeQuantity,
        },
        {
          baseFee,
          feeUnitPrice,
        }
      )
      log(TAG, 'coin tx: ', tx)

      const service = ServiceFactory.getService(currentNetwork.chainType)
      const signWallet = await wallet.restore(pwd, currentAccount.index)
      const raw = await signWallet.signTransaction(tx)
      const hash = await service.sendRawTransaction(currentNetwork.rpc, [raw])

      nav('/home/send-done?hash=' + hash, {
        replace: true,
      })
    } catch (e) {
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
            sender={txMeta.current?.from ?? ''}
            recipient={txMeta.current?.to ?? ''}
            amount=""
            symbol=""
          />
          <FormItem
            name="amount"
            label={t('page.send.label.amount')}
            action={
              <span className={css.labelAction}>
                {t('page.send.text.balance')}: {toMaximalUnit(coinBalance, currentNetwork?.chainType)} {currentNetwork?.symbol}
              </span>
            }
          >
            <Input
              type="text"
              suffix={
                <span>{currentNetwork?.symbol}</span>
              }
              value={sendAmount}
              onChange={changeAmount}
            />
          </FormItem>
          <FeeWithRefresh
            onFeeChange={changeFee}
          />
        </Form>
      </Container>

      <Footer>
        <Button onClick={handleCancel}>{t('page.send.sign.btn.cancel')}</Button>
        <Button
          disabled={loading || baseFee === '' || feeUnitPrice === '' || sendAmount === ''}
          variant="primary"
          onClick={send}
        >{t('page.send.sign.btn.review')}</Button>
      </Footer>

      <ActionSheet open={showConfirm} onOpenChange={() => setShowConfirm(false)}>
        <ActionSheetContent loading={loading} title={t('page.send.sign.review.title')}>
          <TxConfirm
            isToken={false}
            from={txMeta.current?.from ?? ''}
            to={txMeta.current?.to ?? ''}
            amount={sendAmount}
            symbol={currentNetwork?.symbol ?? ''}
            baseFee={baseFee}
            feeUnitPrice={feeUnitPrice}
            onConfirm={handleSubmit}
          />
        </ActionSheetContent>
      </ActionSheet>
    </>
  )
}


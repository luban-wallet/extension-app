import { useContext, useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router"
import Button from "../../../components/button"
import Footer from "../../../components/footer"
import { Form, FormItem } from "../../../components/form"
import Input from "../../../components/input"
import Pageheader from "../../../components/page-header"
import { I18nContext } from "../../../contexts/I18nContext"
import Container from "../../../components/container"
import ServiceFactory from "../../../services/ServiceFactory"
import { WalletContext } from "../../../contexts/WalletContext"
import SendNonce from "../../../components-oo/send-nonce"
import { log } from "../../../utils/debug"
import IconContact from "../../../components/icons/contact"
import ContactDialog from "../components/contact/dialog"
import FeeWithRefresh from "../../../components/fee/fee-with-refresh"
import { networkDecimals, toMaximalUnit } from "../../../utils/util"
import { ActionSheet, ActionSheetContent } from "../../../components/action-sheet"
import TxConfirmSendCoinAll from "../../../components-oo/tx-confirm-sendcoin-all"
import MsgHelper from "../../../helpers/MsgHelper"
import WalletFactory from "../../../wallets/WalletFactory"
import { MEM_PWD } from "../../../configs/constant"
import { toast } from "sonner"
import TransactionDao from "../../../dao/TransactionDao"
import Alert from "../../../components/alert"

const TAG = '[SendCoin]'
export default function SendCoinAll() {
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showContact, setShowContact] = useState(false)
  const { t } = useContext(I18nContext)!
  const { currentAccount, currentNetwork } = useContext(WalletContext)!
  const [nonce, setNonce] = useState('')
  const [to, setTo] = useState('')
  const [baseFee, setBaseFee] = useState('')
  const [feeUnitPrice, setFeeUnitPrice] = useState('')
  const [coinBalance, setCoinBalance] = useState('0')
  const nav = useNavigate()
  const [search] = useSearchParams()

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    if(currentNetwork === null || currentAccount === null) {
      return
    }

    try {
      setLoading(true)
      const address = search.get('address')
      const service = ServiceFactory.getService(currentNetwork)
      const nonce = await service.getTransactionCount(currentNetwork.rpc, currentAccount.address)
      const coin = await service.getCoinBalance(currentNetwork.rpc, currentAccount.address)
      
      setCoinBalance(coin.available)
      setNonce(BigInt(nonce).toString())
      if(address !== null) {
        setTo(address)
      }
      setLoading(false)
    } catch(e) {
      log(TAG, e)
    }
  }

  const changeTo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTo(e.target.value)
  }

  const changeNonce = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNonce(e.target.value)
  }

  const changeFee = (fee: { baseFee: string, priorityFee: string }) => {
    log(TAG, 'fee changed: ', fee)
    setBaseFee(fee.baseFee)
    setFeeUnitPrice(fee.priorityFee)
  }

  const handleNext = async () => {
    if(currentNetwork === null || currentAccount === null) {
      return
    }

    setShowConfirm(true)
  }

  const handleSubmit = async (payload: { gasLimit: string, transactionFee: bigint, canSendAmount: bigint }) => {
    if(currentAccount === null || currentNetwork === null) {
      return
    }
    const { gasLimit, transactionFee, canSendAmount } = payload

    // Check balance
    const balance = BigInt(coinBalance)
    if(canSendAmount + transactionFee > balance) {
      toast.error(t('page.send.msg.insufficientbalance'))
      return
    }

    try {
      const pwd = await MsgHelper.memGet<string>(MEM_PWD)
      if(pwd === '') {
        toast.error(t('page.send.sign.msg.walleterror'))
        return
      }

      setLoading(true)

      const service = ServiceFactory.getService(currentNetwork)
      let wallet = await WalletFactory.getLazyWallet(currentNetwork)
      wallet = await wallet.restore(pwd, currentAccount.index)

      const txBase = await wallet.prepareSweepBaseCoinTransaction({
        from: currentAccount.address,
        to: to,
        nonce: nonce !== '' ? Number(nonce) : undefined,
      })
      const tx = await wallet.prepareSweepCoinTransaction(
        {
          ...txBase,
          value: canSendAmount.toString(),
          gasLimit: gasLimit,
        },
        {
          baseFee,
          feeUnitPrice,
        }
      )
      log(TAG, 'coin tx: ', tx)

      const raw = await wallet.signTransaction(tx)
      const hash = await service.sendRawTransaction(currentNetwork.rpc, [raw])

      // Save tx
      await new TransactionDao().insert({
        from: tx.from,
        to: tx.to,
        contract: '',
        name: currentNetwork.symbol,
        amount: canSendAmount.toString(),
        decimals: networkDecimals(currentNetwork.chainType),
        chainId: currentNetwork.chainId,
        hash: hash,
        type: 'out',
        status: '',
        timestamp: Date.now(),
      })

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
          <FormItem
            name="amount"
            label={t('page.send.label.amount')}
          >
            <h2 style={{fontSize: '28px'}}>
              {toMaximalUnit(coinBalance, currentNetwork?.chainType)} {currentNetwork?.symbol}
            </h2>
          </FormItem>
          <FormItem name="to" label={t('page.send.label.to')}>
            <Input
              type="text"
              value={to}
              onChange={changeTo}
              suffix={
                <Button
                  variant="ghost"
                  style={{width: '28px', height: '28px'}}
                  onClick={() => setShowContact(true)}
                >
                  <IconContact width={16} height={16} />
                </Button>
              }
            />
          </FormItem>
          <SendNonce
            value={nonce}
            onChange={changeNonce}
          />
          <FeeWithRefresh
            onFeeChange={changeFee}
          />
        </Form>
        <div style={{marginTop: '16px'}}>
          <Alert>
            {t('page.send.txsendcoinall.confirm.notice')}
          </Alert>
        </div>
      </Container>

      <Footer>
        <Button
          variant="primary"
          disabled={loading || to === '' || coinBalance === '0'}
          onClick={handleNext}
        >{t('page.send.sign.btn.review')}</Button>
      </Footer>

      {/* Preview Order */}
      <ActionSheet open={showConfirm} onOpenChange={() => setShowConfirm(false)}>
        <ActionSheetContent loading={loading} title={t('page.send.sign.review.title')}>
          <TxConfirmSendCoinAll
            from={currentAccount?.address ?? ''}
            to={to}
            amount={coinBalance}
            symbol={currentNetwork?.symbol ?? ''}
            baseFee={baseFee}
            feeUnitPrice={feeUnitPrice}
            onConfirm={handleSubmit}
          />
        </ActionSheetContent>
      </ActionSheet>

      {showContact ? (
        <ContactDialog
          show={showContact}
          onClose={() => setShowContact(false)}
          onSelect={(address) => setTo(address)}
        />
      ) : null}
    </>
  )
}

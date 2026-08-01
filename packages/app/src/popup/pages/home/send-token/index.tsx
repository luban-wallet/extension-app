import { useContext, useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router"
import { toast } from "sonner"
import Button from "../../../components/button"
import Footer from "../../../components/footer"
import { Form, FormItem } from "../../../components/form"
import Input from "../../../components/input"
import Pageheader from "../../../components/page-header"
import { I18nContext } from "../../../contexts/I18nContext"
import { formatUnits, parseUnits } from "../../../utils/util"
import Container from "../../../components/container"
import TokenSelect from "../../../components/token-select"
import type { IToken } from "../../../configs/token"
import ServiceFactory from "../../../services/ServiceFactory"
import { log } from "../../../utils/debug"
import { WalletContext } from "../../../contexts/WalletContext"
import WalletFactory from "../../../wallets/WalletFactory"
import SendNonce from "../../../components-oo/send-nonce"

import css from './index.module.css'

const TAG = '[SendToken]'

export default function SendToken() {
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()
  const { t } = useContext(I18nContext)!
  const { currentAccount, currentNetwork, tokenTxMeta } = useContext(WalletContext)!
  const [tokenBalance, setTokenBalance] = useState('0')
  const [nonce, setNonce] = useState('')
  const [to, setTo] = useState('')
  const [sendAmount, setSendAmount] = useState('')
  const [searchParams] = useSearchParams()
  const [currentToken, setCurrentToken] = useState<IToken | null>(null)

  const tokenId = searchParams.get('id') as string

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
      const nonce = await service.getTransactionCount(currentNetwork.rpc, currentAccount.address)
      setNonce(BigInt(nonce).toString())
      setLoading(false)
    } catch(e) {
      console.error(e)
    }
  }

  const changeTo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTo(e.target.value)
  }
  const changeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSendAmount(e.target.value)
  }
  const changeNonce = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNonce(e.target.value)
  }

  const selectToken = (token: IToken, tokenBalance: string) => {
    setCurrentToken(token)
    setTokenBalance(tokenBalance)
  }

  const handleNext = async () => {
    if(currentAccount === null || currentNetwork === null || currentToken === null) {
      return
    }

    // Check balance
    const realAmount = parseUnits(sendAmount, Number(currentToken.decimals))
    if(realAmount > BigInt(tokenBalance)) {
      toast.error(t('page.send.msg.insufficientbalance')!)
      return
    }

    try {
      setLoading(true)
      const wallet = await WalletFactory.getLazyWallet(currentNetwork.chainType)
      tokenTxMeta.current = await wallet.prepareBaseTokenTransaction(
        currentNetwork,
        {
          from: currentAccount.address,
          to: to,
          nonce: Number(nonce),
          value: realAmount.toString(),
          contract: currentToken,
        }
      )
      log(TAG, 'tx', tokenTxMeta.current)

      nav('/home/send-token-sign', {
        replace: true
      })
    } catch(e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Pageheader title={t('page.send.header')} />
      <Container footer>
        <Form>
          <FormItem name="to" label={t('page.send.label.selecttoken')}>
            <TokenSelect tokenId={tokenId} onSelect={selectToken} />
          </FormItem>
          <FormItem name="to" label={t('page.send.label.to')}>
            <Input type="text" onChange={changeTo} />
          </FormItem>
          <FormItem
            name="amount"
            label={t('page.send.label.amount')}
            action={
              <span className={css.labelAction}>{t('page.send.text.balance')}: {formatUnits(tokenBalance, Number(currentToken?.decimals))} {currentToken?.symbol}</span>
            }
          >
            <Input
              type="text"
              suffix={
                <span>{currentToken?.symbol}</span>
              }
              onChange={changeAmount}
            />
          </FormItem>
          <SendNonce
            value={nonce}
            onChange={changeNonce}
          />
        </Form>
      </Container>

      <Footer>
        <Button disabled={loading || currentToken === null} variant="primary" onClick={handleNext}>{t('common.text.next')}</Button>
      </Footer>
    </>
  )
}

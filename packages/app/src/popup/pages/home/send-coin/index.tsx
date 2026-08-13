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
import WalletFactory from "../../../wallets/WalletFactory"
import SendNonce from "../../../components-oo/send-nonce"

export default function SendCoin() {
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()
  const { t } = useContext(I18nContext)!
  const { currentAccount, currentNetwork, txMeta } = useContext(WalletContext)!
  const [nonce, setNonce] = useState('')
  const [to, setTo] = useState('')
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
      const service = ServiceFactory.getService(currentNetwork.chainType)
      const nonce = await service.getTransactionCount(currentNetwork.rpc, currentAccount.address)
      setNonce(BigInt(nonce).toString())
      if(address !== null) {
        setTo(address)
      }
      setLoading(false)
    } catch(e) {
      console.error(e)
    }
  }

  const changeTo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTo(e.target.value)
  }

  const changeNonce = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNonce(e.target.value)
  }

  const handleNext = async () => {
    if(currentNetwork === null || currentAccount === null) {
      return
    }

    try {
      setLoading(true)
      const wallet = await WalletFactory.getLazyWallet(currentNetwork.chainType)
      txMeta.current = await wallet.prepareBaseCoinTransaction(
        currentNetwork,
        {
          from: currentAccount.address,
          to: to,
          nonce: nonce !== '' ? Number(nonce) : undefined,
        }
      )
      nav('/home/send-coin-sign', {
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
          <FormItem name="to" label={t('page.send.label.to')}>
            <Input
              type="text"
              value={to}
              onChange={changeTo}
            />
          </FormItem>
          <SendNonce
            value={nonce}
            onChange={changeNonce}
          />
        </Form>
      </Container>

      <Footer>
        <Button
          disabled={loading}
          variant="primary"
          onClick={handleNext}
        >{t('common.text.next')}</Button>
      </Footer>
    </>
  )
}

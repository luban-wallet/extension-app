import { useContext, useRef, useState } from "react"
import { useNavigate } from "react-router"
import Button from "../../../components/button"
import Footer from "../../../components/footer"
import { Form, FormItem } from "../../../components/form"
import Input from "../../../components/input"
import Pageheader from "../../../components/page-header"
import type { IToken } from "../../../configs/token"
import { I18nContext } from "../../../contexts/I18nContext"
import TokenDao from "../../../dao/TokenDao"
import { TokenContext } from "../../../contexts/TokenContext"
import Container from "../../../components/container"
import ServiceFactory from "../../../services/ServiceFactory"
import { WalletContext } from "../../../contexts/WalletContext"
import { toast } from "sonner"

export default function TokenAdd() {
  const [loading, setLoading] = useState(false)
  const timer = useRef<unknown>(0)
  const { t } = useContext(I18nContext)!
  const [meta, setMeta] = useState<IToken | null>(null)
  const { currentNetwork } = useContext(WalletContext)!
  const { setCachedTokens } = useContext(TokenContext)!
  const nav = useNavigate()

  const fetchMetadata = (e: React.ChangeEvent<HTMLInputElement>) => {
    globalThis.clearTimeout(timer.current as number);
    timer.current = globalThis.setTimeout(() => {
      makeRpcCall(e.target.value)
    }, 500);
  }

  const makeRpcCall = async (v: string) => {
    if(currentNetwork === null || v === '') {
      return
    }

    try {
      setLoading(true)
      const service = ServiceFactory.getService(currentNetwork.chainType)
      const data = await service.getTokenMetadata(currentNetwork.rpc, v)
      // console.log(data)

      const token = {
        ...data,
        chainId: currentNetwork.chainId,
        contract: v
      }
      setMeta(token)
    } catch(e) {
      toast.error((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const addToken = async () => {
    if(!meta) {
      return
    }

    setLoading(true)
    await new TokenDao().insert(meta)
    setCachedTokens(currentNetwork!.chainId, null)
    setLoading(false)
    nav(-1)
  }

  return (
    <>
      <Pageheader title={t('page.addtoken.header')} />

      <Container>
        <Form>
          <FormItem label={t('page.addtoken.label.contract')}>
            <Input onChange={fetchMetadata} />
          </FormItem>
          {
            meta !== null ? (
              <FormItem label={t('page.addtoken.label.symbol')}>
                <Input disabled value={meta.symbol} />
              </FormItem>
            ) : null
          }
          {
            meta !== null ? (
              <FormItem label={t('page.addtoken.label.decimals')}>
                <Input disabled value={meta.decimals} />
              </FormItem>
            ) : null
          }
        </Form>
      </Container>

      <Footer>
        <Button loading={loading} disabled={meta === null || loading} variant="primary" onClick={addToken}>{t('page.addtoken.btn')}</Button>
      </Footer>
    </>
  )
}

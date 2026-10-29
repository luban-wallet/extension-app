import { useContext, useEffect, useRef, useState } from "react"
import { useNavigate, useSearchParams } from "react-router"
import Button from "../../../components/button"
import Footer from "../../../components/footer"
import Success from "../../../components/success"
import { I18nContext } from "../../../contexts/I18nContext"
import { log } from "../../../utils/debug"
import ServiceFactory from "../../../services/ServiceFactory"
import { WalletContext } from "../../../contexts/WalletContext"
import Loading from "../../../components/loading"
import Pageheader from "../../../components/page-header"

const TAG = '[SendDone]'
const FETCH_INTERVAL = 5000
export default function SendDone() {
  const [loading, setLoading] = useState(true)
  const nav = useNavigate()
  const { t } = useContext(I18nContext)!
  const { currentNetwork } = useContext(WalletContext)!
  const [ searchParams ] = useSearchParams()
  const timer = useRef(0)

  const handleDone = () => {
    nav('/home', {
      replace: true
    })
  }

  const fetchTx = async () => {
    globalThis.clearTimeout(timer.current)

    const hash = searchParams.get('hash')
    if(currentNetwork === null || hash === null) {
      return
    }

    try {
      const data = await ServiceFactory.getService(currentNetwork.chainType)
        .getTransactionStatus(currentNetwork.rpc, hash)
      if(data !== null) {
        setLoading(false)
      } else {
        timer.current = globalThis.setTimeout(fetchTx, FETCH_INTERVAL) as unknown as number
      }
    } catch(e) {
      log(TAG, e)
    }
  }

  useEffect(() => {
    fetchTx()

    return () => {
      globalThis.clearTimeout(timer.current)
    }
  }, [])

  return (
    <>
      <Pageheader showBack={false} title={t('page.send.header')} />
      <div style={{display: 'flex', paddingTop: '120px', justifyContent: 'center'}}>
        {
          loading ?
            <Loading size={60} />
          :
            <Success msg={t('page.send.done.msg.success')} />
        }
      </div>
      <Footer>
        <Button variant="secondary" onClick={handleDone}>{t('page.send.done.btn')}</Button>
      </Footer>
    </>
  )
}
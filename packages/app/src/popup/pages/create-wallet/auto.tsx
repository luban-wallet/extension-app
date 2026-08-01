import { useContext, useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router"
import { Storage } from '@luban/wallet-storage'
import Button from "../../components/button"
import Footer from "../../components/footer"
import Pageheader from "../../components/page-header"
import Loading from "../../components/loading"
import Success from "../../components/success"
import { MEM_WORDS } from "../../configs/constant"
import { I18nContext } from "../../contexts/I18nContext"
import WalletFactory from "../../wallets/WalletFactory"

import css from './auto.module.css'

export default function AutoGenerate() {
  const [loading, setLoading] = useState(true)
  const { t } = useContext(I18nContext)!
  const nav = useNavigate()
  const [ search ] = useSearchParams()

  const count = search.get('c')

  useEffect(() => {
    generate()
  }, [])

  const generate = () => {
    if(count === null) {
      return
    }

    const phrase = WalletFactory.getMnemonic().createPhrase(Number(count))
    Storage.getInstance('mem').set(MEM_WORDS, phrase)
    setLoading(false)
  }

  const handleNext = () => {
    nav('/create-wallet/done')
  }

  return (
    <>
      <Pageheader title={t('page.create.auto.header')} />
      <div className={css.content}>
        {
          loading ? <Loading /> : <Success msg={t('page.create.auto.tip')} />
        }
      </div>

      <Footer>
        <Button disabled={loading} variant="primary" onClick={handleNext}>{t('common.text.next')}</Button>
      </Footer>
    </>
  )
}

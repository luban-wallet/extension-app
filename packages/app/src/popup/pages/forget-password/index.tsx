import { useContext, useState } from "react"
import { useNavigate } from "react-router"
import { Storage } from "@luban/wallet-storage"
import Pageheader from "../../components/page-header"
import { I18nContext } from "../../contexts/I18nContext"
import Container from "../../components/container"
import Footer from "../../components/footer"
import Button from "../../components/button"
import { ActionSheet, ActionSheetContent } from "../../components/action-sheet"
import IconSafe from "../../components/icons/safe"
import { LOCAL_CURRENT_ACCOUNT, LOCAL_CURRENT_CHAIN, LOCAL_KEYSTORE, WALLET_DB } from "../../configs/constant"
import IconRepair from "../../components/icons/repair"

import css from './index.module.css'

export default function ForgetPassword() {
  const [loading, setLoading] = useState(false)
  const [showTip, setShowTip] = useState(false)
  const { t } = useContext(I18nContext)!
  const nav = useNavigate()

  const del = async () => {
    try {
      setLoading(true)

      globalThis.indexedDB.deleteDatabase(WALLET_DB)
      await Storage.getInstance('local').batchRemove([
        LOCAL_CURRENT_ACCOUNT,
        LOCAL_CURRENT_CHAIN,
        LOCAL_KEYSTORE
      ])

      setTimeout(() => {
        setLoading(false)
        nav('/')
      }, 1000);

    } catch(e) {
      console.error(e)
    }
  }

  const goTry = () => {
    nav('/tool')
  }

  return (
    <>
      <Pageheader
        title={t('page.forgetpassword.header')}
        slot={
          <Button variant="ghost" className={css.repair} onClick={goTry}>
            <IconRepair width={16} height={16} />
          </Button>
        }
      />
      <Container>
        <p className={css.info}>{t('page.forgetpassword.info1')}</p>
        <p className={css.info}>{t('page.forgetpassword.info2')}</p>
      </Container>

      <Footer>
        <Button className={css.btn} onClick={() => setShowTip(true)}>{t('page.forgetpassword.btn.delete')}</Button>
      </Footer>

      <ActionSheet open={showTip} onOpenChange={() => setShowTip(false)}>
        <ActionSheetContent title="">
          <div className={css.confirmContent}>
            <div className={css.confirmIcon}><IconSafe width={64} height={64} /></div>
            <p className={css.confirmText}>{t('page.forgetpassword.confirm')}</p>
          </div>
          <div>
            <Button disabled={loading} className={css.btn} onClick={del}>{t('page.forgetpassword.btn.delete')}</Button>
          </div>
        </ActionSheetContent>
      </ActionSheet>
    </>
  )
}

import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { Storage } from "@luban/wallet-storage"
import Crypto from '@lubankit/crypto'
import { toast } from "sonner"
import { ActionSheet, ActionSheetContent } from "../../components/action-sheet"
import Button from "../../components/button"
import Footer from "../../components/footer"
import Pageheader from "../../components/page-header"
import WordsList from "../../components/words-list"
import Alert from "../../components/alert"
import { LOCAL_CURRENT_ACCOUNT, LOCAL_KEYSTORE, MEM_PWD, MEM_WORDS } from "../../configs/constant"
import { I18nContext } from "../../contexts/I18nContext"
import Container from "../../components/container"
import MsgHelper from "../../helpers/MsgHelper"
import WalletFactory from "../../wallets/WalletFactory"
import { WalletContext } from "../../contexts/WalletContext"
import AccountsDao from "../../dao/AccountsDao"

export default function Done() {
  const [showTip, setShowTip] = useState(false)
  const [words, setWords] = useState<string>('')
  const nav = useNavigate()
  const { t } = useContext(I18nContext)!
  const { setAndCacheAccount } = useContext(WalletContext)!

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    try {
      const pwd = await MsgHelper.memGet<string>(MEM_PWD)
      const words = await Storage.getInstance<string>('mem').remove(MEM_WORDS)
      if(pwd === '' || words === null) {
        toast.error(t('common.msg.params.error'))
        return
      }
      const valut = await Crypto.getInstance().encrypt(words, pwd)
      const dao = new AccountsDao()
      const wallet = (await WalletFactory.getLazyWallet('EVM')).create(words)
      const account = dao.makeDefaultAccount(wallet.address(), 'EVM')

      // save wallet
      await dao.insert(account)
      await Storage.getInstance('local').batchSet({
        [LOCAL_CURRENT_ACCOUNT]: account,
        [LOCAL_KEYSTORE]: valut,
      })
      await setAndCacheAccount(account)

      setWords(words)
    } catch(e) {
      console.error(e)
    }
  }

  const handleNext = () => {
    setShowTip(true)
  }

  const goHome = async () => {
    nav('/home', {
      replace: true,
    })
  }

  return (
    <>
      <Pageheader showBack={false} title={t('page.create.done.header')} />
      <Container footer>
        <Alert>{t('page.create.done.tip')}</Alert>
        <br />
        <WordsList words={words} />
      </Container>
      <Footer>
        <Button disabled={words === ''} variant="primary" onClick={handleNext}>{t('common.text.done')}</Button>
      </Footer>

      <ActionSheet open={showTip} onOpenChange={() => setShowTip(false)}>
        <ActionSheetContent title={t('page.create.done.confirm.title')}>
          <div style={{paddingBottom: '28px', lineHeight: 1.5, }}>
            <p>{t('page.create.done.confirm.desc1')}</p>
            <p>{t('page.create.done.confirm.desc2')}</p>
            <p>{t('page.create.done.confirm.desc3')}</p>
          </div>
          <div>
            <Button variant="primary" onClick={goHome}>{t('page.create.done.confirm.btn')}</Button>
          </div>
        </ActionSheetContent>
      </ActionSheet>
    </>
  )
}

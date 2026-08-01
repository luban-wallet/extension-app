import { useContext, useState } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import Crypto from "@lubankit/crypto"
import { Storage } from "@luban/wallet-storage"
import Pageheader from "../../components/page-header"
import { I18nContext } from "../../contexts/I18nContext"
import Container from "../../components/container"
import { Form, FormItem } from "../../components/form"
import Input, { Textarea } from "../../components/input"
import Footer from "../../components/footer"
import Button from "../../components/button"
import AccountsDao from "../../dao/AccountsDao"
import { LOCAL_CURRENT_ACCOUNT, LOCAL_KEYSTORE, MEM_PWD } from "../../configs/constant"
import MsgHelper from "../../helpers/MsgHelper"
import WalletFactory from "../../wallets/WalletFactory"
import { WalletContext } from "../../contexts/WalletContext"

export default function ImportWallet() {
  const [loading, setLoading] = useState(false)
  const {t} = useContext(I18nContext)!
  const { setAndCacheAccount } = useContext(WalletContext)!
  const nav = useNavigate()

  const createWallet = async () => {
    const form = document.getElementById('import_form') as HTMLFormElement
    const formData = new FormData(form)
    const password = formData.get('password') as string
    const confirming = formData.get('confirming') as string
    let mnemonic = formData.get('mnemonic') as string
    mnemonic = mnemonic.trim()

    if(password === '' || confirming === '' || mnemonic === '') {
      toast.error(t('page.import.msg.requireerror'))
      return
    }

    if(password !== confirming) {
      toast.error(t('page.import.msg.passwordinconsistent'))
      return
    }

    const words = mnemonic.split(' ')
    if (words.length !== 12 && words.length !== 24) {
      toast.error(t('page.import.msg.mnemonicerror'))
      return
    }

    try {
      setLoading(true)

      const dao = new AccountsDao()
      const wallet = (await WalletFactory.getLazyWallet('EVM')).create(mnemonic)
      const account = dao.makeDefaultAccount(wallet.address(), 'EVM')
      const valut = await Crypto.getInstance().encrypt(mnemonic, password)

      // save wallet
      await MsgHelper.memSet(MEM_PWD, password)
      await dao.insert(account)
      await Storage.getInstance('local').batchSet({
        [LOCAL_CURRENT_ACCOUNT]: account,
        [LOCAL_KEYSTORE]: valut,
      })
      await setAndCacheAccount(account)

      nav('/home', {
        replace: true,
      })
    } catch(e) {
      toast.error((e as Error).message)
    }
  }

  return (
    <>
      <Pageheader title={t('page.import.header')} />
      <Container>
        <Form id="import_form">
          <FormItem label={t('page.import.label.password')}>
            <Input type="password" name="password" />
          </FormItem>
          <FormItem label={t('page.import.label.confirming')}>
            <Input type="password" name="confirming" />
          </FormItem>
          <FormItem label={t('page.import.label.mnemonic')}>
            <Textarea name="mnemonic" rows={6} />
          </FormItem>
        </Form>
      </Container>

      <Footer>
        <Button disabled={loading} variant="primary" onClick={createWallet}>{t('page.import.btn')}</Button>
      </Footer>
    </>
  )
}

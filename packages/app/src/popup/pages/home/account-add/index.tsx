import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import Button from "../../../components/button"
import Footer from "../../../components/footer"
import { Form, FormItem } from "../../../components/form"
import Input from "../../../components/input"
import Pageheader from "../../../components/page-header"
import { I18nContext } from "../../../contexts/I18nContext"
import { MEM_PWD } from "../../../configs/constant"
import AccountsDao from "../../../dao/AccountsDao"
import MsgHelper from "../../../helpers/MsgHelper"
import Container from "../../../components/container"
import WalletFactory from "../../../wallets/WalletFactory"
import { WalletContext } from "../../../contexts/WalletContext"
import { DERIVATION_PATHS } from "../../../configs/account"

export default function AccountAdd() {
  const [loading, setLoading] = useState(false)
  const [nextIndex, setNextIndex] = useState<number>(0)
  const { t } = useContext(I18nContext)!
  const { currentNetwork } = useContext(WalletContext)!
  const [name, setName] = useState('')
  const nav = useNavigate()

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    if(currentNetwork === null) {
      return
    }

    setLoading(true)

    let index = nextIndex
    const accounts = await new AccountsDao().getAllByIndex('chainType', currentNetwork.chainType)
    if(accounts !== null) {
      accounts.forEach((v) => {
        if(v.index > index) {
          index = v.index
        }
      })
    }
    index++

    setNextIndex(index)
    setName(`Account ${index}`)
    setLoading(false)
  }

  const changeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const add = async () => {
    if(currentNetwork === null) {
      return
    }

    try {
      const pwd = await MsgHelper.memGet<string>(MEM_PWD)
      if(pwd === '') {
        toast.error(t('common.msg.params.error'))
        return
      }

      setLoading(true)
      const wallet = await WalletFactory.getLazyWallet(currentNetwork.chainType)
      await wallet.restore(pwd, nextIndex)

      await new AccountsDao().insert({
        index: nextIndex,
        alias: name,
        address: wallet.address(),
        chainType: currentNetwork.chainType,
        derivationPath: DERIVATION_PATHS[currentNetwork.chainType] + nextIndex
      })

      toast.success(t('page.addaccount.msg.success'))
      nav(-1)
    } catch(e) {
      toast.error((e as Error).message)
    }
  }

  return (
    <>
      <Pageheader title={t('page.addaccount.header')} />

      <Container>
        <Form>
          <FormItem label="Account Name">
            <Input value={name} onChange={changeName} />
          </FormItem>
        </Form>
      </Container>

      <Footer>
        <Button disabled={loading} variant="primary" onClick={add}>{t('page.addaccount.btn.add')}</Button>
      </Footer>
    </>
  )
}

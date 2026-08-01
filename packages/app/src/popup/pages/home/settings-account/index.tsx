import { useContext, useEffect, useState } from "react"
import Button from "../../../components/button"
import ColorIcon from "../../../components/color-icon"
import Container from "../../../components/container"
import Pageheader from "../../../components/page-header"
import type { IAccount } from "../../../configs/account"
import AccountsDao from "../../../dao/AccountsDao"
import { formatAddress } from "../../../utils/util"
import { Dialog, DialogContent } from "../../../components/dialog"
import Input from "../../../components/input"
import { I18nContext } from "../../../contexts/I18nContext"
import ActionBtn from "../components/action-btn"
import { WalletContext } from "../../../contexts/WalletContext"

import css from "./index.module.css"

export default function SettingsAccount() {
  const { t } = useContext(I18nContext)!
  const { currentAccount, currentNetwork, setAndCacheAccount } = useContext(WalletContext)!
  const [list, setList] = useState<IAccount[] | null>(null)
  const [current, setCurrent] = useState<IAccount | null>(null)
  const [deleting, setDeleting] = useState<IAccount | null>(null)

  useEffect(() => {
    loadList()
  }, [currentAccount])

  const loadList = async () => {
    if(currentNetwork === null) {
      return
    }

    const json = await new AccountsDao().getAllByIndex('chainType', currentNetwork.chainType)
    setList(json)
  }

  const closeDialog = () => {
    setCurrent(null)
    setDeleting(null)
  }
  const edit = (account: IAccount) => {
    setCurrent(account)
  }

  const del = (account: IAccount) => {
    setDeleting(account)
  }

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const alias = new FormData(form).get('alias') as string
    if(alias === '') {
      return
    }

    const data = {
      ...current!,
      alias
    }
    await new AccountsDao().update(data)
    // If it's the current account, update the context
    if(currentAccount?.address === data.address) {
      setAndCacheAccount(data)
    } else {
      loadList()
    }

    closeDialog()
  }

  const deleteAccount = async () => {
    await new AccountsDao().delete(deleting?.id ?? 0)
    closeDialog()
    loadList()
  }

  return (
    <>
      <Pageheader title={t('page.settings.account.header')} />

      <Container footer>
        <div className={css.wrapper}>
        {
          list?.map((item) => (
            <div key={item.id} className={css.item}>
              <div className={css.avatar}>
                <ColorIcon size={40} name={item.alias} />
              </div>
              <div>
                <p className={css.name}><b>{item.alias}</b></p>
                <p className={css.addr}>{formatAddress(item.address)}</p>
              </div>
              <div>
                <ActionBtn canDel={currentAccount?.address !== item.address} data={item} onEdit={edit} onDel={del} />
              </div>
            </div>
          ))
        }
        </div>
      </Container>

      <Dialog open={current !== null} onOpenChange={closeDialog}>
        <DialogContent title={t('page.settings.account.edit.header')}>
          <form onSubmit={submitEdit}>
            <Input name="alias" defaultValue={current?.alias} />
            <div style={{marginTop: '12px'}}>
              <Button type="submit" variant="primary">{t('page.settings.account.edit.btn')}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleting !== null} onOpenChange={closeDialog}>
        <DialogContent title={t('page.settings.account.delete.header')}>
          <div>{t('page.settings.account.delete.tip')}</div>
          <div style={{marginTop: '32px'}}>
            <Button variant="primary" onClick={deleteAccount}>{t('page.settings.account.edit.btn')}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

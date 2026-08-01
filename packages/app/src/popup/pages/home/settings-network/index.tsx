import { useContext, useEffect, useState } from "react"
import Button from "../../../components/button"
import ColorIcon from "../../../components/color-icon"
import Container from "../../../components/container"
import Pageheader from "../../../components/page-header"
import { Dialog, DialogContent } from "../../../components/dialog"
import Input from "../../../components/input"
import { I18nContext } from "../../../contexts/I18nContext"
import ActionBtn from "../components/action-btn"
import NetworkDao from "../../../dao/NetworkDao"
import type { INetwork } from "../../../configs/network"
import { Form, FormItem } from "../../../components/form"
import Select, { SelectItem } from "../../../components/select"
import { WalletContext } from "../../../contexts/WalletContext"

import css from "./index.module.css"

export default function SettingsNetwork() {
  const { t } = useContext(I18nContext)!
  const { currentNetwork } = useContext(WalletContext)!
  const [list, setList] = useState<INetwork[] | null>(null)
  const [current, setCurrent] = useState<INetwork | null>(null)
  const [deleting, setDeleting] = useState<INetwork | null>(null)

  useEffect(() => {
    loadList()
  }, [])

  const loadList = async () => {
    const json = await new NetworkDao().getAll()
    setList(json)
  }

  const closeDialog = () => {
    setCurrent(null)
    setDeleting(null)
  }
  const edit = (account: INetwork) => {
    setCurrent(account)
  }

  const del = (account: INetwork) => {
    setDeleting(account)
  }

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    const data = {
      id: current?.id
    }
    for (const pair of formData.entries()) {
      // @ts-expect-error todo
      data[pair[0]] = pair[1]
    }
    // console.log(data)

    await new NetworkDao().update(data as INetwork)
    closeDialog()
    loadList()
  }

  const deleteAccount = async () => {
    await new NetworkDao().delete(deleting?.id ?? 0)
    closeDialog()
    loadList()
  }

  return (
    <>
      <Pageheader title={t('page.settings.network.header')} />

      <Container footer>
        <div className={css.wrapper}>
        {
          list?.map((item) => (
            <div key={item.id} className={css.item}>
              <div className={css.avatar}>
                <ColorIcon size={40} name={item.name} />
              </div>
              <div>{item.name}</div>
              <div>
                {
                  currentNetwork?.chainId === item.chainId ? null : (
                    <ActionBtn canDel data={item} onEdit={edit} onDel={del} />
                  )
                }
              </div>
            </div>
          ))
        }
        </div>
      </Container>

      <Dialog open={current !== null} onOpenChange={closeDialog}>
        <DialogContent title={t('page.settings.account.header')}>
          <Form onSubmit={submitEdit}>
            <FormItem label={t('page.settings.network.edit.label.chainid')}>
              <Input name="chainId" defaultValue={current?.chainId} />
            </FormItem>
            <FormItem label={t('page.settings.network.edit.label.icon')}>
              <Input name="icon" defaultValue={current?.icon} />
            </FormItem>
            <FormItem label={t('page.settings.network.edit.label.name')}>
              <Input name="name" defaultValue={current?.name} />
            </FormItem>
            <FormItem label={t('page.settings.network.edit.label.symbol')}>
              <Input name="symbol" defaultValue={current?.symbol} />
            </FormItem>
            <FormItem label={t('page.settings.network.edit.label.rpc')}>
              <Input name="rpc" defaultValue={current?.rpc} />
            </FormItem>
            <FormItem label={t('page.settings.network.edit.label.explorer')}>
              <Input name="explorer" defaultValue={current?.explorer} />
            </FormItem>
            <FormItem label={t('page.settings.network.edit.label.testnet')}>
              <Select name="testnet" defaultValue={current?.testnet}>
                <SelectItem value="0">No</SelectItem>
                <SelectItem value="1">Yes</SelectItem>
              </Select>
            </FormItem>
            <FormItem label={t('page.settings.network.edit.label.chaintype')}>
              <Select name="chainType" defaultValue={current?.chainType}>
                <SelectItem value="EVM">EVM</SelectItem>
              </Select>
            </FormItem>

            <div style={{marginTop: '12px'}}>
              <Button type="submit" variant="primary" onClick={deleteAccount}>{t('page.settings.network.edit.btn')}</Button>
            </div>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleting !== null} onOpenChange={closeDialog}>
        <DialogContent title={t('page.settings.network.delete.header')}>
          <div>{t('page.settings.network.delete.tip')}</div>
          <div style={{marginTop: '32px'}}>
            <Button variant="primary" onClick={deleteAccount}>{t('page.settings.network.edit.btn')}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

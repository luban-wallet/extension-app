import { useContext, useEffect, useState } from "react"
import ColorIcon from "../../../../components/color-icon"
import Container, { Column } from "../../../../components/container"
import Pageheader from "../../../../components/page-header"
import { formatAddress } from "../../../../utils/util"
import { I18nContext } from "../../../../contexts/I18nContext"
import ContactDao from "../../../../dao/ContactDao"
import type { IContact } from "../../../../configs/contact"
import Button from "../../../../components/button"
import Footer from "../../../../components/footer"
import { Dialog, DialogContent } from "../../../../components/dialog"
import Input from "../../../../components/input"
import { Form, FormItem } from "../../../../components/form"
import ActionBtn from "../../components/action-btn"
import CopyText from "../../../../components/copy-text"

import css from "./index.module.css"

export default function SettingsContact() {
  const [showAdd, setShowAdd] = useState(false)
  const { t } = useContext(I18nContext)!
  const [list, setList] = useState<IContact[] | null>(null)

  useEffect(() => {
    loadList()
  }, [])

  const loadList = async () => {
    const json = await new ContactDao().getAll()
    setList(json)
  }

  const add = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const address = formData.get('address') as string

    if(name === '' || address === '') {
      return
    }

    await new ContactDao().insert({ name, address })
    setShowAdd(false)
    loadList()
  }

  const del = async (contact: IContact) => {
    await new ContactDao().delete(contact.id!)
    loadList()
  }

  return (
    <>
      <Pageheader
        title={t('page.settings.contact.header')}
      />

      <Container footer>
        <Column>
        {
          list?.map((item) => (
            <div key={item.id} className={css.item}>
              <div className={css.avatar}>
                <ColorIcon size={40} name={item.name} />
              </div>
              <div>
                <p className={css.name}><b>{item.name}</b></p>
                <p className={css.addr}>
                  <span>{formatAddress(item.address)}</span>
                  <CopyText size={16} value={item.address} />
                </p>
              </div>
              <div>
                <ActionBtn
                  canEdit={false}
                  canDel
                  data={item}
                  onEdit={() => {}}
                  onDel={del}
                />
              </div>
            </div>
          ))
        }
        </Column>
      </Container>

      <Footer>
        <Button onClick={() => setShowAdd(true)}>{t('page.settings.contact.dialog.title')}</Button>
      </Footer>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent title={t('page.settings.contact.dialog.title')}>
          <Form onSubmit={add}>
            <FormItem label={t('page.settings.contact.label.name')}>
              <Input name="name" autoComplete="off" />
            </FormItem>
            <FormItem label={t('page.settings.contact.label.address')}>
              <Input name="address" autoComplete="off" />
            </FormItem>

            <Button type="submit" variant="primary">{t('page.settings.contact.btn.submit')}</Button>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}

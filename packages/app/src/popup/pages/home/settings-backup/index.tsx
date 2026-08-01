import { useContext, useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import Crypto, { type Keystore } from '@lubankit/crypto'
import { Storage } from '@luban/wallet-storage'
import Button from '../../../components/button'
import Footer from '../../../components/footer'
import { Form, FormItem } from '../../../components/form'
import Input from '../../../components/input'
import Pageheader from '../../../components/page-header'
import { I18nContext } from '../../../contexts/I18nContext'
import { LOCAL_KEYSTORE, MEM_WORDS } from '../../../configs/constant'
import Container from '../../../components/container'

export default function Backup() {
  const { t } = useContext(I18nContext)!
  const nav = useNavigate()
  const [password, setPassword] = useState('')

  const changePwd = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const showDetail = async () => {
    const vault = await Storage.getInstance<Keystore>('local').get(LOCAL_KEYSTORE)
    const rs = await Crypto.getInstance().decrypt(vault!, password)
    if(rs === '') {
      toast.error(t('common.msg.password.error'))
      return
    }

    await Storage.getInstance('mem').set(MEM_WORDS, rs)

    nav('/home/settings/backup/detail', {
      replace: true,
    })
  }

  return (
    <>
      <Pageheader title={t('page.settings.backup.header')} />

      <Container>
        <Form>
          <FormItem label={t('page.settings.backup.label.password')}>
            <Input type="password" onChange={changePwd} />
          </FormItem>
        </Form>
      </Container>

      <Footer>
        <Button variant="primary" disabled={password === ''} onClick={showDetail}>{t('common.text.next')}</Button>
      </Footer>
    </>
  )
}

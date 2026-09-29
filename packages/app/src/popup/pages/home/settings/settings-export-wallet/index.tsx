import { useContext, useState, type ChangeEvent } from 'react'
import { toast } from 'sonner'
import Crypto, { type Keystore } from '@lubankit/crypto'
import { Storage } from '@luban/wallet-storage'
import Button from '../../../../components/button'
import Footer from '../../../../components/footer'
import { Form, FormItem } from '../../../../components/form'
import Input from '../../../../components/input'
import Pageheader from '../../../../components/page-header'
import { I18nContext } from '../../../../contexts/I18nContext'
import { LOCAL_KEYSTORE } from '../../../../configs/constant'
import Container from '../../../../components/container'
import { log } from '../../../../utils/debug'

const TAG = '[ExportWallet]'
export default function ExportWallet() {
  const [loading, setLoading] = useState(false)
  const { t } = useContext(I18nContext)!
  const [password, setPassword] = useState('')

  const changePwd = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const showDetail = async () => {
    try {
      setLoading(true)

      const vault = await Storage.getInstance<Keystore>('local').get(LOCAL_KEYSTORE)
      const rs = await Crypto.getInstance().decrypt(vault!, password)
      if(rs === '') {
        toast.error(t('common.msg.password.error'))
        return
      }

      // download
      const blob = new globalThis.Blob([JSON.stringify(vault)], { type: 'application/json' })
      const url = globalThis.URL.createObjectURL(blob)
      const a = globalThis.document.createElement('a')
      a.href = url
      a.download = 'keystore.bin'
      a.click()
      globalThis.URL.revokeObjectURL(url)

      setPassword('')
    } catch (e) {
      log(TAG, e)
      toast.error((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Pageheader title={t('page.settings.exportwallet.header')} />

      <Container>
        <Form>
          <FormItem label={t('common.text.password')}>
            <Input type="password" onChange={changePwd} />
          </FormItem>
        </Form>
      </Container>

      <Footer>
        <Button
          variant="primary"
          disabled={password === '' || loading}
          loading={loading}
          onClick={showDetail}
        >{t('page.settings.exportwallet.btn.download')}</Button>
      </Footer>
    </>
  )
}

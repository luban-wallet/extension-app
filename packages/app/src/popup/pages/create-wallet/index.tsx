import { useContext, useState, type ChangeEvent } from "react"
import { useNavigate } from "react-router"
import Pageheader from "../../components/page-header"
import { I18nContext } from "../../contexts/I18nContext"
import Footer from "../../components/footer"
import Button from "../../components/button"
import Input from "../../components/input"
import { Form, FormItem } from "../../components/form"
import Alert from "../../components/alert"
import { MEM_PWD } from "../../configs/constant"
import Container from "../../components/container"
import MsgHelper from "../../helpers/MsgHelper"

export default function Password() {
  const nav = useNavigate()
  const { t } = useContext(I18nContext)!
  const [password, setPassword] = useState('')
  const [confirming, setConfirming] = useState('')

  const changePassword = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setPassword(v)
  }

  const changeConfirming = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setConfirming(v)
  }

  const handleSubmit = async () => {
    if(password === '' || confirming !== password) {
      return
    }

    try {
      await MsgHelper.memSet(MEM_PWD, password)
      nav('/create-wallet/type')
    } catch(e) {
      console.error(e)
    }
  }

  return (
    <>
      <Pageheader title={t('page.create.password.header')} />
      <Container>
        <Alert>
          {t('page.create.password.tip')}
        </Alert>

        <Form style={{marginTop: '16px'}}>
          <FormItem name="password" label={t('page.create.password.label.password')}>
            <Input
              type="password"
              value={password}
              onChange={changePassword}
            />
          </FormItem>
          <FormItem name="confirming" label={t('page.create.password.label.confirming')}>
            <Input
              type="password"
              value={confirming}
              onChange={changeConfirming}
            />
          </FormItem>
        </Form>
      </Container>
      <Footer>
        <Button variant="primary" disabled={password === '' || confirming !== password} onClick={handleSubmit}>{t('common.text.next')}</Button>
      </Footer>
    </>
  )
}

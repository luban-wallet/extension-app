import { useNavigate } from "react-router"
import Button from "../../../components/button"
import Footer from "../../../components/footer"
import Success from "../../../components/success"
import { useContext } from "react"
import { I18nContext } from "../../../contexts/I18nContext"

export default function SendDone() {
  const nav = useNavigate()
  const { t } = useContext(I18nContext)!

  const handleDone = () => {
    nav('/home', {
      replace: true
    })
  }

  return (
    <>
      <div style={{display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center'}}>
        <Success msg={t('page.send.done.msg.success')} />
      </div>

      <Footer>
        <Button variant="secondary" onClick={handleDone}>{t('page.send.done.btn')}</Button>
      </Footer>
    </>
  )
}
import { useContext } from "react"
import { useNavigate } from "react-router"
import Pageheader from "../../../components/page-header"
import { I18nContext } from "../../../contexts/I18nContext"
import Container from "../../../components/container"

import css from './index.module.css'

export default function About() {
  const { t } = useContext(I18nContext)!
  const nav = useNavigate()

  const donate = () => {
    // Todo: replace with network specific address
    const address = '0xBb4ff4a9E82D0057162787D999566a563523B428'
    nav('/home/send-coin?address=' + address)
  }

  return (
    <>
      <Pageheader title={t('page.about.header')} />
      <Container>
        <div className={css.wrapper}>
          <img src="/logo.png" width="80" height="80" />
          <h2 className={css.title}>{t('common.brand.title')}</h2>
          <p className={css.describe}>
            <span>{t('page.about.description')}</span>
            <a onClick={donate} style={{textDecoration: 'underline', padding: '0 8px', cursor: 'pointer'}}>Donate</a>
          </p>
        </div>
      </Container>
    </>
  )
}

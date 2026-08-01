import { useContext, type MouseEvent } from "react"
import Pageheader from "../../../components/page-header"
import { I18nContext } from "../../../contexts/I18nContext"
import Container from "../../../components/container"
import { languageList } from "../../../i18n/config"
import Button from "../../../components/button"
import CheckIcon from "../../../components/check-icon"

import css from './index.module.css'

export default function SettingsLanguage() {
  const { t, lang, setAndCacheLanguage } = useContext(I18nContext)!

  const changelang = (e: MouseEvent) => {
    const t = e.target as HTMLElement
    const v = t.dataset.v
    if(v === undefined) {
      return
    }

    setAndCacheLanguage(v)
  }

  return (
    <>
      <Pageheader title={t('page.settings.language.header')} />

      <Container>
        <div className={css.wrapper} onClick={changelang}>
          {
            languageList.map((item) => (
              <Button key={item.value} className={css.item} data-v={item.value}>
                <b>{item.label}</b>
                {lang === item.value ? (
                  <CheckIcon />
                ) : null}
              </Button>
            ))
          }
        </div>
      </Container>
    </>
  )
}

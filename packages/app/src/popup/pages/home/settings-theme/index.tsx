import { useContext, type MouseEvent } from "react"
import Pageheader from "../../../components/page-header"
import Container from "../../../components/container"
import Button from "../../../components/button"
import { ThemeContext } from "../../../contexts/ThemeContext"
import { I18nContext } from "../../../contexts/I18nContext"
import CheckIcon from "../../../components/check-icon"
import type { Theme } from "../../../hooks/useTheme"

import css from './index.module.css'

export default function SettingsTheme() {
  const { t } = useContext(I18nContext)!
  const { theme, setAndCacheTheme } = useContext(ThemeContext)!

  const changeTheme = (e: MouseEvent) => {
    const t = e.target as HTMLElement
    const v = t.dataset.v
    if(v === undefined) {
      return
    }

    setAndCacheTheme(v as Theme)
  }

  return (
    <>
      <Pageheader title={t('page.settings.theme.header')} />

      <Container>
        <div className={css.wrapper} onClick={changeTheme}>
          <Button className={css.item} data-v="Light">
            <b>{t('page.settings.theme.text.light')}</b>
            {theme === 'Light' ? (
              <CheckIcon />
            ) : null}
          </Button>
          <Button className={css.item} data-v="Dark">
            <b>{t('page.settings.theme.text.dark')}</b>
            {theme === 'Dark' ? (
              <CheckIcon />
            ) : null}
          </Button>
        </div>
      </Container>
    </>
  )
}

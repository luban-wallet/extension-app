import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router"
import Pageheader from "../../../components/page-header"
import WordsList from "../../../components/words-list"
import { I18nContext } from "../../../contexts/I18nContext"
import { Storage } from "@luban/wallet-storage"
import { MEM_WORDS } from "../../../configs/constant"
import Footer from "../../../components/footer"
import Button from "../../../components/button"
import Container from "../../../components/container"

import css from './index.module.css'

export default function BackupDetail() {
  const [show, setShow] = useState(false)
  const { t } = useContext(I18nContext)!
  const nav = useNavigate()
  const [words, setWords] = useState('')

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    const words = await Storage.getInstance<string>('mem').remove(MEM_WORDS)
    if(words !== null) {
      setWords(words)
    }
  }

  const done = () => {
    nav('/home', {
      replace: true
    })
  }

  return (
    <>
      <Pageheader />
      <Container footer>
        <p className={css.info}>{t('page.settings.backup.detail.tip')}</p>

        <div className={css.detail} onClick={() => setShow(true)}>
          {!show ? <img src="/images/blur-bg.png" width="100%" /> : null}
          {
            !show ? (
              <div className={css.detailTip}>
                {t('page.settings.backup.detail.confirming')}
              </div>
            ) : null
          }
          {show ? <WordsList words={words} /> : null}
        </div>
      </Container>

      <Footer>
        <Button onClick={done} variant="primary">{t('common.text.done')}</Button>
      </Footer>
    </>
  )
}

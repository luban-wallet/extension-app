import { useContext, useEffect, useState, type MouseEvent } from "react"
import Pageheader from "../../../../components/page-header"
import Container, { Column } from "../../../../components/container"
import Button from "../../../../components/button"
import { I18nContext } from "../../../../contexts/I18nContext"
import CheckIcon from "../../../../components/check-icon"
import { LOCAL_LIFE_MS } from "../../../../configs/constant"
import { Storage } from "@luban/wallet-storage"
import { log } from "../../../../utils/debug"

import css from './index.module.css'

const TAG = '[SettingsTimer]'

// Minutes list
const LIST = ['1', '5', '10']
export default function SettingsTimer() {
  const { t } = useContext(I18nContext)!
  const [ timer, setTimer ] = useState('')

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    try {
      const ms = await Storage.getInstance<string>('local').get(LOCAL_LIFE_MS)
      if(ms === null) {
        return
      }
      setTimer((BigInt(ms) / 60n / 1000n).toString())
    } catch(e) {
      log(TAG, e)
    }
  }

  const changeTimer = (e: MouseEvent) => {
    const t = e.target as HTMLElement
    const v = t.dataset.v
    if(v === undefined) {
      return
    }

    setTimer(v)
    Storage.getInstance('local').set(LOCAL_LIFE_MS, (BigInt(v) * 60n * 1000n).toString())
  }

  return (
    <>
      <Pageheader title={t('page.settings.timer.header')} />

      <Container>
        <Column onClick={changeTimer}>
          {LIST.map((v) => {
            return (
              <Button key={v} className={css.item} data-v={v}>
                <b>{v} {t('common.text.minutes')}</b>
                {timer === v ? (
                  <CheckIcon />
                ) : null}
              </Button>
            )
          })}
        </Column>
      </Container>
    </>
  )
}

import { useContext, useEffect, useState } from 'react'
import { toast } from "sonner"
// @ts-expect-error no types
import QRCode from "qrcode"
import IconEye, { IconEyeClose } from '../icons/eye'
import Button from '../button'
import IconCopy from '../icons/copy'
import { copyText } from '../../utils/util'
import { I18nContext } from '../../contexts/I18nContext'
import SwitchTab, { type SwitchItem } from '../switch-tab'
import { log } from '../../utils/debug'

import css from './index.module.css'

const TAG = '[WordsList]'

export default function WordsList(props: {words: string}) {
  const [showQr, setShowQr] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const { t } = useContext(I18nContext)!

  const TABS = [
    { label: t('common.text.mnemonics'), value: 1 },
    { label: t('common.text.qrcode'), value: 2 },
  ]
  const words = props.words ?? ''

  useEffect(() => {
    initQRCode()
  }, [props.words])

  const initQRCode = () => {
    if(words === '') {
      log(TAG, 'Empty mnemonics')
      return
    }

    const canvas = document.querySelector('#qrcanvas')
    QRCode.toCanvas(canvas, words, {
      width: 200,
      margin: 0
    }, () => {})
  }

  const toggleShow = () => {
    setShowAll(!showAll)
  }

  const copyWords = () => {
    copyText(words)
    toast.success(t('common.msg.copy.ok'))
  }

  const changeTab = (item: SwitchItem) => {
    setShowQr(item.value === 2)
  }

  return (
    <div>
      <SwitchTab values={TABS} value={showQr ? 2 : 1} onChange={changeTab} />
      <div style={{display: showQr ? 'block' : 'none'}} className={css.qrWrapper}>
        <canvas id="qrcanvas" width={200} height={200} className={css.qrCanvas} />
      </div>
      <div style={{display: showQr ? 'none' : 'grid'}} className={css.wordsWrapper}>
        {
          words.trim().split(' ').map((word, index) => (
            <WordItem key={index} index={index + 1} word={word} showAll={showAll} />
          ))
        }
      </div>
      <div className={css.actions}>
        <Button onClick={toggleShow}>
          <IconEye />
          <span>{showAll ? t('common.text.hide') : t('common.text.show')}</span>
        </Button>
        <Button onClick={copyWords}>
          <IconCopy width={18} height={18} />
          <span>{t('common.text.copy')}</span>
        </Button>
      </div>
    </div>
  )
}

function WordItem(props: {index: number, word: string, showAll: boolean}) {
  const { index, word, showAll } = props
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(showAll)
  }, [showAll])

  const toggleShow = () => {
    setShow(!show)
  }

  return (
    <div className={css.item}>
      <span className={css.itemNo}>{index}.</span>
      <span className={css.word}>{show ? word : '******'}</span>
      <span className={css.icon} onClick={toggleShow}>
        {show ? <IconEye /> : <IconEyeClose />}
      </span>
    </div>
  )
}

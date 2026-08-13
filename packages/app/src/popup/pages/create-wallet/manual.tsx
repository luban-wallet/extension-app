import { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import WalletCanvas from '@luban/wallet-canvas'
import { Storage } from '@luban/wallet-storage'
import Button from "../../components/button"
import Footer from "../../components/footer"
import Pageheader from "../../components/page-header"
import { I18nContext } from '../../contexts/I18nContext'
import Container, { Title } from '../../components/container'
import { MEM_WORDS } from '../../configs/constant'
import WalletFactory from '../../wallets/WalletFactory'

import css from './manual.module.css'

export default function ManualGenerate() {
  const [showMask, setShowMask] = useState(true)
  const [done, setDone] = useState(false)
  const nav = useNavigate()
  const canvas = useRef<WalletCanvas | null>(null)
  const { t } = useContext(I18nContext)!
  const [ search ] = useSearchParams()

  const count = search.get('c')

  useEffect(() => {
    initCanvas()
  }, [])

  const initCanvas = () => {
     if(count === null) {
      return
    }
    if(canvas.current !== null) {
      return
    }

    canvas.current = new WalletCanvas()
    canvas.current.init('canvas')
    canvas.current.onFinish = async () => {
      const bits = count === '12' ? 128 : 256
      const entropy = await canvas.current!.toEntropy(bits)
      if(entropy !== null) {
        const words = WalletFactory.getMnemonic().createPhraseFromEntropy(entropy)
        Storage.getInstance('mem').set(MEM_WORDS, words)
      }
      setDone(true)
    }
  }

  const handleClearCanvas = () => {
    canvas.current?.clear()
    setShowMask(true)
  }

  const handleNext = () => {
    nav('/create-wallet/done')
  }

  const handleRmMask = () => {
    setShowMask(false)
  }

  return (
    <>
      <Pageheader title={t('page.create.manual.header')} />
      <Container>
        <Title>{t('page.create.manual.title')}</Title>
        <div id="canvas" className={css.canvas}>
          <div
            style={{display: showMask ? 'flex' : 'none'}}
            className={css.mask}
            onClick={handleRmMask}
          >{t('page.create.manual.tip')}</div>
        </div>
        <div className={css.clearCanvas}>
          <Button variant='link' onClick={handleClearCanvas}>{t('page.create.manual.redo')}</Button>
        </div>
      </Container>
      <Footer>
        <Button disabled={!done} variant="primary" onClick={handleNext}>{t('common.text.next')}</Button>
      </Footer>
    </>
  )
}

import { useContext, useEffect } from "react"
// @ts-expect-error no types
import QRCode from "qrcode"
import { toast } from "sonner"
import ColorIcon from "../../../components/color-icon"
import Pageheader from "../../../components/page-header"
import Button from "../../../components/button"
import Footer from "../../../components/footer"
import SaveQR from "@lubankit/utils/SaveQR"
import { I18nContext } from "../../../contexts/I18nContext"
import { copyText } from "../../../utils/util"
import Container from "../../../components/container"
import { WalletContext } from "../../../contexts/WalletContext"

import css from './index.module.css'

export default function ReceiveCoin() {
  const { t } = useContext(I18nContext)!
  const { currentAccount } = useContext(WalletContext)!

  useEffect(() => {
    initQRCode()
  }, [])

  const initQRCode = () => {
    if(currentAccount === null) {
      return
    }

    const canvas = document.querySelector('#qrcanvas')
    const address = currentAccount.address
    QRCode.toCanvas(canvas, address, {
      width: 200,
      margin: 0
    }, () => {})
  }

  const openQRDialog = () => {
    if(currentAccount === null) {
      return
    }

    const dialog = new SaveQR()
    dialog.render(currentAccount.alias, currentAccount.address, document.querySelector('#qrcanvas')!)
  }

  const copyAddress = () => {
    copyText(currentAccount?.address ?? '')
    toast.success(t('common.msg.copy.ok'))
  }

  return (
    <>
      <Pageheader title={t('page.receive.header')} />

      <Container footer>
        <div className={css.account}>
          <ColorIcon name={currentAccount?.alias ?? ''} font={24} size={64} />
          <div className={css.accountName}>{currentAccount?.alias}</div>
          <div className={css.accountTip}>{t('page.receive.tip')}</div>
        </div>
        <div className={css.qrcode}>
          <canvas id="qrcanvas" width={200} height={200} className={css.qrcanvas} />
        </div>
        <div className={css.address}>
          <div className={css.addressLeft}>
            <h4 className={css.addressLeftTitle}>{t('page.receive.text.address')}</h4>
            <p className={css.addressLeftMain}>
              {currentAccount?.address}
            </p>
          </div>
          <div className={css.addressRight}>
            <Button onClick={copyAddress} variant="primary" className={css.addressRightBtn}>{t('common.text.copy')}</Button>
          </div>
        </div>
      </Container>

      <Footer>
        <Button onClick={openQRDialog}>{t('page.receive.btn.save')}</Button>
      </Footer>
    </>
  )
}

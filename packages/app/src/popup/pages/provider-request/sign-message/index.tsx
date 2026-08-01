import { useContext } from 'react'
import Button from '../../../components/button'
import ColorIcon from '../../../components/color-icon'
import Divider from '../../../components/divider'
import Footer from '../../../components/footer'
import { ProviderRequestContext } from '../../../contexts/ProviderRequestContext'
import { I18nContext } from '../../../contexts/I18nContext'
import useAsyncCallback from '../../../hooks/useAsyncCallback'
import MsgHelper from '../../../helpers/MsgHelper'
import WalletFactory from '../../../wallets/WalletFactory'
import { hexToString } from '../../../utils/util'
import { WalletContext } from '../../../contexts/WalletContext'

import css from './index.module.css'

/**
 * [message, address]
 */
type SignMessagePayload = [string, string]

export default function SignMessage() {
  const { request } = useContext(ProviderRequestContext)!
  const { currentAccount, currentNetwork } = useContext(WalletContext)!
  const { t } = useContext(I18nContext)!

  const metadata = request.current?.metadata
  const payload = (request.current?.payload ?? []) as SignMessagePayload
  const message = payload.length > 0 ? payload[0] : ''
  const address = payload.length > 1 ? payload[1] : ''

  const approve = useAsyncCallback(async () => {
    if(request.current === null || currentNetwork === null || currentAccount === null) {
      return
    }

    if(currentAccount.address !== address) {
      await MsgHelper.providerResponse({
        code: 4004,
        message: 'Address mismatch',
        data: null
      })
      return
    }

    // sign message
    const wallet = await WalletFactory.getLazyWallet(currentNetwork.chainType)
    const signature = await wallet.signMessage(
      message.startsWith('0x') ? hexToString(message) : message
    )
    await MsgHelper.providerResponse({
      code: 0,
      message: 'OK',
      data: signature
    })
  })

  const reject = () => {
    MsgHelper.providerResponse({
      code: 4001,
      message: 'User rejected the request',
      data: null
    })
  }

  const display = message.startsWith('0x') ? hexToString(message) : message

  return (
    <>
      <div className={css.wrapper}>
        <div className={css.metadata}>
          <img src={metadata?.icon} className={css.logo} />
          <span className={css.url}>{metadata?.url}</span>
          <b className={css.description}>{t('page.pr.signmessage.description')}</b>
        </div>
        <Divider space />
        <div className={css.permission}>
          <label className={css.label}>{t('page.pr.signmessage.network')}</label>
          <div className={css.permissionContent}>
            <ColorIcon size={32} name={currentNetwork?.name} url={currentNetwork?.icon} />
            <b className={css.networkName}>{currentNetwork?.name}</b>
          </div>
        </div>
        <div className={css.message}>
          <label className={css.label}>{t('page.pr.signmessage.signtitle')}</label>
          <pre className={css.messageContent}>
            {display}
          </pre>
        </div>
      </div>

      <Footer>
        <Button onClick={reject}>{t('page.pr.btn.reject')}</Button>
        <Button disabled={approve.loading} variant='primary' onClick={approve.execute}>{t('page.pr.btn.approve')}</Button>
      </Footer>
    </>
  )
}

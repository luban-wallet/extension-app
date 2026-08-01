import { useContext } from 'react'
import Button from '../../../components/button'
import ColorIcon from '../../../components/color-icon'
import Footer from '../../../components/footer'
import IconArrowRight from '../../../components/icons/arrow-right'
import { ProviderRequestContext } from '../../../contexts/ProviderRequestContext'
import { I18nContext } from '../../../contexts/I18nContext'
import useAsyncCallback from '../../../hooks/useAsyncCallback'
import NetworkDao from '../../../dao/NetworkDao'
import MsgHelper from '../../../helpers/MsgHelper'
import { WalletContext } from '../../../contexts/WalletContext'

import css from './index.module.css'

type SwitchChainPayload = [{
  chainId: string
}]

export default function SwitchChain() {
  const { request } = useContext(ProviderRequestContext)!
  const { currentNetwork, setAndCacheCurrentNetworkAndAccount } = useContext(WalletContext)!
  const { t } = useContext(I18nContext)!

  const metadata = request.current?.metadata

  const approve = useAsyncCallback(async () => {
    if(request.current === null) {
      return
    }

    const payload = request.current.payload as SwitchChainPayload
    const chainId = payload.length > 0 ? payload[0].chainId : ''

    const find = await new NetworkDao().getOneByIndex('chainId', chainId)
    if(find === null) {
       MsgHelper.providerResponse({
        code: 4902,
        message: 'Unrecognized chain ID',
        data: null
      })
      return
    }

    // switch
    await setAndCacheCurrentNetworkAndAccount(find)

    await MsgHelper.providerResponse({
      code: 0,
      message: 'OK',
      data: null
    })
  })

  const reject = () => {
    MsgHelper.providerResponse({
      code: 4001,
      message: 'User rejected the request',
      data: null
    })
  }

  return (
    <>
      <div className={css.wrapper}>
        <h2 className={css.title}>{t('page.pr.switchchain.title')}</h2>
        <div className={css.metadata}>
          <div className={css.chains}>
            <div className={css.chainsIcon}>
              <ColorIcon size={56} url={currentNetwork?.icon} name={currentNetwork?.name} />
              <span className={css.chainsName}>{currentNetwork?.name}</span>
            </div>
            <IconArrowRight width={20} height={20} />
            <div className={css.chainsIcon}>
              <ColorIcon size={56} url={metadata?.icon} name={metadata?.name} />
              <span className={css.chainsName}>{metadata?.name}</span>
            </div>
          </div>
          <span className={css.url}>{metadata?.url}</span>
          <b className={css.description}>{t('page.pr.switchchain.description')}</b>
        </div>
      </div>

      <Footer>
        <Button onClick={reject}>{t('page.pr.btn.reject')}</Button>
        <Button disabled={approve.loading} variant='primary' onClick={approve.execute}>{t('page.pr.btn.approve')}</Button>
      </Footer>
    </>
  )
}

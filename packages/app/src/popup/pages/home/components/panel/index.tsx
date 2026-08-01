import { useContext } from 'react'
import { useNavigate } from 'react-router'
import Button from '../../../../components/button'
import CopyText from '../../../../components/copy-text'
import IconReceive from '../../../../components/icons/receive'
import IconSend from '../../../../components/icons/send'
import NetworkSelect from '../network-select'
import Setting from '../setting'
import AccountSelect from '../account-select'
import IconList from '../../../../components/icons/list'
import { I18nContext } from '../../../../contexts/I18nContext'
import { WalletContext } from '../../../../contexts/WalletContext'
import HomeBalance from '../../../../components-oo/home-balance'

import css from './index.module.css'

export default function Panel() {
  const { t } = useContext(I18nContext)!
  const { currentAccount, currentNetwork } = useContext(WalletContext)!
  const nav = useNavigate()

  const sendCoin = () => {
    nav('/home/send-coin')
  }

  const receiveAsset = () => {
    nav('/home/receive')
  }

  const activity = () => {
    nav('/home/activities')
  }

  return (
    <header className={css.wrapper}>
      <div className={css.top}>
        <div className={css.topLeft}>
          <img src="/logo.png" width={36} height={36} style={{borderRadius: '12px'}} />
          <span>{t('common.brand.title')}</span>
        </div>
        <div className={css.topRight}>
          <NetworkSelect />
          <Setting />
        </div>
      </div>
      <div className={css.main}>
        <div className={css.balanceWrapper}>
          <div className={css.network}>{currentNetwork?.name}</div>
          <HomeBalance />
          <div className={css.address}>
            <AccountSelect />
            <CopyText size={18} value={currentAccount?.address ?? ''} />
          </div>
        </div>
        <div className={css.actions}>
          <Button className={css.actionBtn} onClick={sendCoin}>
            <div className={css.actionBtnInner}>
              <IconSend width={20} height={20} />
              <p>{t('page.home.panel.btn.send')}</p>
            </div>
          </Button>
          <Button className={css.actionBtn} onClick={receiveAsset}>
            <div className={css.actionBtnInner}>
              <IconReceive width={20} height={20} />
              <p>{t('page.home.panel.btn.receive')}</p>
            </div>
          </Button>
          <Button className={css.actionBtn} onClick={activity}>
            <div className={css.actionBtnInner}>
              <IconList width={20} height={20} />
              <p>{t('page.home.panel.btn.activity')}</p>
            </div>
          </Button>
        </div>
      </div>
    </header>
  )
}

import { useContext } from 'react'
import CopyText from '../../../../components/copy-text'
import NetworkSelect from '../network-select'
import Setting from '../setting'
import AccountSelect from '../account-select'
import { I18nContext } from '../../../../contexts/I18nContext'
import { WalletContext } from '../../../../contexts/WalletContext'
import HomeBalance from '../../../../components-oo/home-balance'
import Refresh from '../refresh'
import HomePanelButtons from '../../../../components-oo/home-panel-buttons'

import css from './index.module.css'

export default function Panel() {
  const { t } = useContext(I18nContext)!
  const { currentAccount, currentNetwork } = useContext(WalletContext)!

  return (
    <header className={css.wrapper}>
      <div className={css.top}>
        <div className={css.topLeft}>
          <img src="/logo.png" width={36} height={36} />
          <span>{t('common.brand.title')}</span>
        </div>
        <div className={css.topRight}>
          <NetworkSelect />
          <Refresh />
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
          <HomePanelButtons />
        </div>
      </div>
    </header>
  )
}

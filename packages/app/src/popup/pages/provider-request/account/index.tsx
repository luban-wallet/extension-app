import { useContext } from 'react'
import Button from '../../../components/button'
import Divider from '../../../components/divider'
import Footer from '../../../components/footer'
import IconSuccess from '../../../components/icons/success'
import ConnectionsDao from '../../../dao/ConnectionsDao'
import MsgHelper from '../../../helpers/MsgHelper'
import useAsyncCallback from '../../../hooks/useAsyncCallback'
import { log } from '../../../utils/debug'
import { ProviderRequestContext } from '../../../contexts/ProviderRequestContext'
import { I18nContext } from '../../../contexts/I18nContext'
import { WalletContext } from '../../../contexts/WalletContext'

import css from './index.module.css'

const TAG = '[ProviderRequestAccount]'

export default function Account() {
  const { request } = useContext(ProviderRequestContext)!
  const { currentAccount } = useContext(WalletContext)!
  const { t } = useContext(I18nContext)!

  const approve = useAsyncCallback(async () => {
    if(request.current === null) {
      return
    }

    await new ConnectionsDao().insert({
      name: request.current.metadata.name,
      icon: request.current.metadata.icon,
      url: request.current.metadata.url,
      timestamp: Date.now()
    })

    await MsgHelper.providerResponse({
      code: 0,
      message: 'OK',
      data: currentAccount === null ? [] : [currentAccount.address]
    })
  })

  const reject = () => {
    MsgHelper.providerResponse({
      code: 4001,
      message: 'User rejected the request',
      data: null
    })
  }

  log(TAG, 'render account page: ', request.current)
  if(request.current === null) {
    return null
  }

  return (
    <>
      <div className={css.wrapper}>
        <h2 className={css.accountTitle}>{t('page.pr.account.title')}</h2>
        <div className={css.metadata}>
          <img className={css.logo} src={request.current.metadata.icon} />
          <span className={css.url}>{request.current.metadata.url}</span>
          <p className={css.description}>{t('page.pr.account.description')}</p>
        </div>
        <Divider space />
        <ul className={css.permission}>
          <li className={css.permissionItem}>
            <IconSuccess width={16} height={16} />
            <span>{t('page.pr.account.permission.account')}</span>
          </li>
          <li className={css.permissionItem}>
            <IconSuccess width={16} height={16} />
            <span>{t('page.pr.account.permission.network')}</span>
          </li>
        </ul>
      </div>

      <Footer>
        <Button onClick={reject}>{t('page.pr.btn.reject')}</Button>
        <Button disabled={approve.loading} variant='primary' onClick={approve.execute}>{t('page.pr.btn.approve')}</Button>
      </Footer>
    </>
  )
}

import { useContext, useState, type MouseEvent } from 'react'
import { ActionSheet, ActionSheetContent } from '../../../../components/action-sheet'
import IconSwitch from '../../../../components/icons/switch'
import Tag from '../../../../components/tag'
import ColorIcon from '../../../../components/color-icon'
import CopyText from '../../../../components/copy-text'
import IconAdd from '../../../../components/icons/add'
import LinkButton from '../../../../components/link-button'
import { I18nContext } from '../../../../contexts/I18nContext'
import { formatAddress } from '../../../../utils/util'
import AccountsDao from '../../../../dao/AccountsDao'
import type { IAccount } from '../../../../configs/account'
import CheckIcon from '../../../../components/check-icon'
import { WalletContext } from '../../../../contexts/WalletContext'
import Badge from '../../../../components/badge'

import css from './index.module.css'

export default function AccountSelect() {
  const [show, setShow] = useState(false)
  const { t } = useContext(I18nContext)!
  const { currentAccount, currentNetwork, setAndCacheAccount } = useContext(WalletContext)!
  const [list, setList] = useState<IAccount[] | null>(null)

  const openList = async () => {
    await initList()
    setShow(true)
  }

  const closeList = () => {
    setShow(false)
  }

  const initList = async () => {
    if(currentNetwork === null) {
      return
    }

    // setLoading(true)
    const list = await new AccountsDao().getAllByIndex('chainType', currentNetwork.chainType)
    setList(list)
    // setLoading(false)
  }

  const selectAccount = (e: MouseEvent<HTMLElement>) => {
    if(!list) {
      return
    }
    const t = e.target as HTMLElement
    const addr = t.dataset.addr
    if(!addr) {
      return
    }

    const account = list.find(i => i.address === addr)
    if(account && account.address !== currentAccount?.address) {
      setAndCacheAccount(account)
    }
    closeList()
  }

  return (
    <>
      <div className={css.wrapper} onClick={openList}>
        <Tag>{t('page.home.panel.account.title')}</Tag>
        <span>{formatAddress(currentAccount?.address)}</span>
        <IconSwitch width={14} height={14} />
      </div>

      <ActionSheet open={show} onOpenChange={closeList}>
        <ActionSheetContent loading={false} title={t('page.home.panel.account.pop.title')}>
          <div className={css.list}>
            <LinkButton to="/home/account-add">
              <IconAdd width={16} height={16} />
              <span>{t('page.home.panel.account.pop.add')}</span>
            </LinkButton>

            <div onClick={selectAccount}>
            {
              list?.map((item) => (
                <section
                  key={item.address}
                  className={css.accountItem}
                >
                  <div className={css.accountItemMask} data-addr={item.address}></div>
                  <div className={css.accountItemIcon}>
                    <ColorIcon size={40} name={item.alias} />
                  </div>
                  <div className={css.accountItemMain}>
                    <div className={css.accountItemMainName}>
                      <span>{item.alias} </span>
                      {currentNetwork !== null ? (
                        <Badge>{item.derivationPath}</Badge>
                      ) : null}
                    </div>
                    <div className={css.accountItemMainAddress}>
                      <span>{formatAddress(item.address)}</span>
                      <CopyText size={16} value={item.address} />
                    </div>
                  </div>
                  {
                    item.address === currentAccount?.address ? (
                      <CheckIcon />
                    ) : null
                  }
                </section>
              ))
            }
            </div>
          </div>
        </ActionSheetContent>
      </ActionSheet>
    </>
  )
}

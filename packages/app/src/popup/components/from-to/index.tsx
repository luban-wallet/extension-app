import { useContext } from 'react'
import { formatAddress } from '../../utils/util'
import IconArrowRight from '../icons/arrow-right'
import { I18nContext } from '../../contexts/I18nContext'

import css from './index.module.css'

interface IProps {
  sender: string
  recipient: string
  amount: string
  symbol: string
}

export default function FromTo(props: IProps) {
  const { sender, recipient, amount, symbol } = props
  const { t } = useContext(I18nContext)!

  return (
    <section className={css.detail}>
      <div className={css.detailTop}>
        <div className={css.detailAccount}>
          <label className={css.detailAccountlabel}>{t('page.send.sign.label.from')}</label>
          <p className={css.detailAccountAddress}>{formatAddress(sender, 12)}</p>
        </div>
        <div className={css.arrow}>
          <IconArrowRight width={16} height={16} />
        </div>
        <div className={css.detailAccount}>
          <label className={css.detailAccountlabel}>{t('page.send.sign.label.to')}</label>
          <p className={css.detailAccountAddress}>{formatAddress(recipient, 12)}</p>
        </div>
      </div>
      {
        amount === '' ? null : <div className={css.line} />
      }
      {
        amount === '' ? null : (
          <div className={css.detailBottom}>
            <label className={css.detailBottomlabel}>{t('page.send.sign.label.amount')}</label>
            <p className={css.detailBottomAmount}>{amount} {symbol}</p>
          </div>
        )
      }
    </section>
  )
}

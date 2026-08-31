import { useContext } from 'react'
import IconLink from '../../../../../components/icons/link'
import IconTxReceive from '../../../../../components/icons/tx-receive'
import IconTxSend from '../../../../../components/icons/tx-send'
import type { ITransaction } from '../../../../../configs/transaction'
import { WalletContext } from '../../../../../contexts/WalletContext'
import { formatAddress, formatUnits } from '../../../../../utils/util'
import Badge from '../../../../../components/badge'

import css from './index.module.css'

interface IProps {
  onSelect: (id: number) => void
  data: ITransaction
}

export default function TxItem(props: IProps) {
  const { data } = props
  const { currentNetwork } = useContext(WalletContext)!

  const renderBadge = () => {
    if(data.status === 'success') {
      return <Badge type="success">Success</Badge>
    }

    if(data.status === 'failed') {
      return <Badge type="failed">Failed</Badge>
    }

    // return <Badge type="default">Pending</Badge>
    return null
  }

  const link = currentNetwork?.explorer + '/tx/' + data.hash
  const amount = formatUnits(data.amount, data.decimals)

  return (
    <div className={css.wrapper}>
      <div className={css.mask} onClick={() => props.onSelect(data.id!)} />
      <div className={css.left}>
        {
          data.type === 'in'
            ? <IconTxReceive width={36} height={36} />
            : <IconTxSend width={36} height={36} />
        }
        <div>
          <label className={css.type}>{data.type === 'in' ? 'Receive' : 'Send'}</label>
          <a className={css.link} target="_blank" href={link}>
            <span>tx:{formatAddress(data.hash, 10)}</span>
            <IconLink width={10} height={10} />
          </a>
        </div>
      </div>
      <div className={css.right}>
        <p className={css.amount}>{data.type === 'in' ? '+' : '-'}{amount} {data.name}</p>
        <div className={css.status}>
          {renderBadge()}
          <span>{data.timestamp ? new Date(data.timestamp).toLocaleDateString() : ''}</span>
        </div>
      </div>
    </div>
  )
}

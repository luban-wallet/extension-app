import { useContext } from 'react'
import { WalletContext } from '../../../../../contexts/WalletContext'
import { formatAddress, toMaximalUnit } from '../../../../../utils/util'
import Row from '../../../../../components/row'
import type { IUTXO } from '../../../../../configs/utxo'
import Button from '../../../../../components/button'

import css from './index.module.css'

interface IProps {
  buttonType: number
  data: IUTXO
  onLockOrUnlock: (data: IUTXO) => void
}

export default function UtxoItem(props: IProps) {
  const { buttonType, data } = props
  const { currentNetwork } = useContext(WalletContext)!

  const lockOrUnlock = () => {
    props.onLockOrUnlock(data)
  }

  const link = currentNetwork?.explorer + '/tx/' + data.txid
  const amount = toMaximalUnit(BigInt(data.value).toString(), currentNetwork?.chainType)

  return (
    <div className={css.wrapper}>
      <Row label="Output">
        <a className={css.link} target="_blank" href={link}>
          <span>{formatAddress(data.txid + ':' + data.vout)}</span>
        </a>
      </Row>
      <Row label="Balance">{amount} BTC</Row>
      {
        buttonType === 1 ? (
          <Button variant="border" className={css.lockBtn} onClick={lockOrUnlock}>Lock</Button>
        ) : (
          <Button variant="border" className={css.lockBtn} onClick={lockOrUnlock}>Unlock</Button>
        )
      }
    </div>
  )
}

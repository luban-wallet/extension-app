import { useContext, useEffect, useState } from "react"
import { Dialog, DialogContent } from "../../../../../components/dialog"
import Row from "../../../../../components/row"
import type { ITransaction } from "../../../../../configs/transaction"
import { I18nContext } from "../../../../../contexts/I18nContext"
import { formatAddress, formatUnits } from "../../../../../utils/util"
import CopyText from "../../../../../components/copy-text"
import ServiceFactory from "../../../../../services/ServiceFactory"
import { WalletContext } from "../../../../../contexts/WalletContext"
import Badge from "../../../../../components/badge"
import TransactionDao from "../../../../../dao/TransactionDao"
import { log } from "../../../../../utils/debug"

interface IProps {
  id: number
  onClose: () => void
}

const TAG = '[Transaction_DetailDialog]'
export default function DetailDialog(props: IProps) {
  const { id } = props
  const { t } = useContext(I18nContext)!
  const { currentNetwork } = useContext(WalletContext)!
  const [data, setData] = useState<ITransaction | null>(null)

  const loadStatus = async () => {
    if(currentNetwork === null || id === 0) {
      return
    }

    try {
      const dao = new TransactionDao()
      const service = ServiceFactory.getService(currentNetwork.chainType)
      const tx = await dao.getOne(id)
      if(tx === null) {
        throw new Error('Transaction not found')
      }
      setData(tx)

      const json = await service.getTransactionStatus(currentNetwork.rpc, tx.hash)
      if(json.status === 'success' || json.status === 'failed') {
        if(tx.status !== json.status) {
          const payload = {...tx, status: json.status}
          await dao.update(payload)
          setData(payload)
          log(TAG, 'update status', payload)
        }
      }
    } catch(e) {
      log(TAG, e)
    }
  }

  useEffect(() => {
    loadStatus()
  }, [])

  if(data === null) {
    return null
  }

  return (
    <Dialog open={true} onOpenChange={props.onClose}>
      <DialogContent title={t('common.text.detail')}>
        <div style={{display: 'flex', flexDirection: 'column', rowGap: '16px'}}>
          <Row label={t('common.text.from')}>{formatAddress(data.from)}</Row>
          <Row label={t('common.text.to')}>
            <div style={{display: 'flex', alignItems: 'center', columnGap: '2px'}}>
              <span>{formatAddress(data.to)}</span>
              <CopyText value={data.to} size={18} />
            </div>
          </Row>
          <Row label={t('common.text.amount')}>{formatUnits(data.amount, data.decimals)} {data.name}</Row>
          <Row label={t('common.text.txid')}>
            <div style={{display: 'flex', alignItems: 'center', columnGap: '2px'}}>
              <span>{formatAddress(data.hash)}</span>
              <CopyText value={data.hash} size={18} />
            </div>
          </Row>
          <Row label={t('common.text.time')}>{new Date(data.timestamp).toLocaleString()}</Row>
          <Row label="">
            <Badge
              type={data.status === 'success'
                ? 'success'
                : (data.status === 'failed' ? 'failed' : 'default')
              }
            >{data.status}</Badge>
          </Row>
        </div>
      </DialogContent>
    </Dialog>
  )
}

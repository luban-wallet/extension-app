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

interface IProps {
  data: ITransaction | null
  onClose: () => void
}

export default function DetailDialog(props: IProps) {
  const { data } = props
  const { t } = useContext(I18nContext)!
  const { currentNetwork } = useContext(WalletContext)!
  const [status, setStatus] = useState<'' | 'pending' | 'success' | 'failed'>('')

  const loadStatus = async () => {
    if(currentNetwork === null || data === null) {
      return
    }

    try {
      const service = ServiceFactory.getService(currentNetwork.chainType)
      const json = await service.getTransactionStatus(currentNetwork.rpc, data.hash)

      // if(json.status === 'success' || json.status === 'failed') {
      //   if(data.status !== json.status) {
      //     const payload = {...data, status: json.status}
      //     await new TransactionDao().update(payload)
      //     log(TAG, 'update status', payload)
      //   }
      // }
      setStatus(json.status)

    } catch(e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadStatus()
  }, [])

  return (
    <Dialog open={true} onOpenChange={props.onClose}>
      <DialogContent title={t('common.text.detail')}>
        <div style={{display: 'flex', flexDirection: 'column', rowGap: '8px'}}>
          <Row label={t('common.text.from')}>{formatAddress(data?.from)}</Row>
          <Row label={t('common.text.to')}>
            <div style={{display: 'flex', alignItems: 'center', columnGap: '2px'}}>
              <span>{formatAddress(data?.to)}</span>
              <CopyText value={data?.to ?? ''} size={18} />
            </div>
          </Row>
          <Row label={t('common.text.amount')}>{formatUnits(data?.amount, data?.decimals)} {data?.name}</Row>
          <Row label={t('common.text.txid')}>
            <div style={{display: 'flex', alignItems: 'center', columnGap: '2px'}}>
              <span>{formatAddress(data?.hash)}</span>
              <CopyText value={data?.hash ?? ''} size={18} />
            </div>
          </Row>
          <Row label={t('common.text.time')}>{new Date(data?.timestamp ?? 0).toLocaleString()}</Row>
          <Row label="">
            <Badge
              type={status === 'success' ? 'success' : (status === 'failed' ? 'failed' : 'default')}
            >{status.toUpperCase()}</Badge>
          </Row>
        </div>
      </DialogContent>
    </Dialog>
  )
}

import { useContext, useState } from 'react'
import Button from '../../../components/button'
import ColorIcon from '../../../components/color-icon'
import Footer from '../../../components/footer'
import FromTo from '../../../components/from-to'
import { I18nContext } from '../../../contexts/I18nContext'
import useAsyncCallback from '../../../hooks/useAsyncCallback'
import { ProviderRequestContext } from '../../../contexts/ProviderRequestContext'
import MsgHelper from '../../../helpers/MsgHelper'
import { toMaximalUnit } from '../../../utils/util'
import FeeWithRefresh from '../../../components/fee/fee-with-refresh'
import { log } from '../../../utils/debug'
import WalletFactory from '../../../wallets/WalletFactory'
import ServiceFactory from '../../../services/ServiceFactory'
import { MEM_PWD } from '../../../configs/constant'
import { WalletContext } from '../../../contexts/WalletContext'
import IconWarn from '../../../components/icons/warn'

import css from './index.module.css'

type TransactionPayload = [{
  from: string
  to: string
  data: string
  value: string
  [key: string]: string
}]

const TAG = '[SendTransaction]'
const DANGEROUS_METHODS: Record<string, string> = {
  '0x095ea7b3': 'page.pr.sendtransaction.danger.approve',
  '0xa9059cbb': 'page.pr.sendtransaction.danger.transfer',
  '0x423f6cef': 'page.pr.sendtransaction.danger.transfer'
}

// [
//   {
//     "from": "0x......",
//     "to": "0x......",
//     "data": "0x......"
//   }
// ]
export default function SendTransaction() {
  const { request } = useContext(ProviderRequestContext)!
  const { currentAccount, currentNetwork } = useContext(WalletContext)!
  const { t } = useContext(I18nContext)!
  const [baseFee, setBaseFee] = useState('')
  const [priorityFee, setPriorityFee] = useState('')

  const metadata = request.current?.metadata
  const payload = (request.current?.payload ?? []) as TransactionPayload
  const payloadData = payload.length > 0 ? payload[0] : null

  const changeFee = (fee: { baseFee: string, priorityFee: string }) => {
    log(TAG, 'fee changed: ', fee)
    setBaseFee(fee.baseFee)
    setPriorityFee(fee.priorityFee)
  }

  const approve = useAsyncCallback(async () => {
    if(payloadData === null || request.current === null || currentNetwork === null || currentAccount === null) {
      return
    }

    if(currentAccount.address !== payloadData.from) {
      await MsgHelper.providerResponse({
        code: 4004,
        message: 'Address mismatch',
        data: null
      })
      return
    }

    const pwd = await MsgHelper.memGet<string>(MEM_PWD)
    if(pwd === '') {
      await MsgHelper.providerResponse({
        code: 4007,
        message: 'Wallet error',
        data: null
      })
      return
    }

    const service = ServiceFactory.getService(currentNetwork.chainType)
    const nonce = await service.getTransactionCount(currentNetwork.rpc, currentAccount.address)

    const tx = {
      ...payloadData,

      nonce: Number(nonce),
      chainId: currentNetwork.chainId,
      type: 2,
      maxPriorityFeePerGas: priorityFee,
      gasLimit: payloadData.gasLimit ?? payloadData.gas,
      maxFeePerGas: (BigInt(baseFee) + BigInt(priorityFee)).toString(),
    }
    Reflect.deleteProperty(tx, 'gas')
    log(TAG, 'coin tx: ', tx)

    const wallet = await WalletFactory.getLazyWallet(currentNetwork.chainType)
    await wallet.restore(pwd, currentAccount.index)

    const raw = await wallet.signTransaction(tx)
    const hash = await service.sendRawTransaction(currentNetwork!.rpc, [raw])

    await MsgHelper.providerResponse({
      code: 0,
      message: 'OK',
      data: hash
    })
  })

  const reject = () => {
    MsgHelper.providerResponse({
      code: 4001,
      message: 'User rejected the request',
      data: null
    })
  }

  const checkData = (data: string | undefined): string => {
    if(!data) {
      return ''
    }

    let danger = ''
    for(const method in DANGEROUS_METHODS) {
      if(data.includes(method)) {
        danger = DANGEROUS_METHODS[method]
        break
      }
    }

    return danger
  }

  const dangerous = checkData(payloadData?.data)

  return (
    <>
      <div className={css.wrapper}>
        <div className={css.metadata}>
          <ColorIcon size={56} url={metadata?.icon} name={metadata?.name} />
          <div className={css.chainsName}>{metadata?.url ?? 'Unknown'}</div>
          <div>{t('page.pr.sendtransaction.title')}</div>
        </div>
        <FromTo
          sender={payloadData?.from ?? ''}
          recipient={payloadData?.to ?? ''}
          amount={toMaximalUnit(payloadData?.value, currentNetwork?.chainType)}
          symbol={currentNetwork?.symbol ?? ''}
        />

        <div className={css.data}>
          <label className={css.dataTitle}>{t('page.pr.sendtransaction.data')}</label>
          {
            dangerous === '' ? null : (
              <div className={css.dataCheck}>
                <IconWarn width={20} height={20} />
                <span>{t(dangerous)}</span>
              </div>
            )
          }
          <div className={css.dataDetail}>{payloadData?.data}</div>
        </div>

        <FeeWithRefresh
          onFeeChange={changeFee}
        />
      </div>

      <Footer>
        <Button onClick={reject}>{t('page.pr.btn.reject')}</Button>
        <Button disabled={approve.loading} variant='primary' onClick={approve.execute}>{t('page.pr.btn.approve')}</Button>
      </Footer>
    </>
  )
}

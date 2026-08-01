import { useContext, useEffect, useState, type ChangeEvent, type MouseEvent } from 'react'
import { toast } from 'sonner'
import Button from '../../components/button'
import Input from '../../components/input'
import Skeleton from '../../components/skeleton'
import { I18nContext } from '../../contexts/I18nContext'
import SimpleEvent from '@lubankit/utils/SimpleEvent'
import { EVENT_REFRESH_FEE } from '../../configs/constant'
import type { INetwork } from '../../configs/network'
import ServiceFactory from '../../services/ServiceFactory'
import { log } from '../../utils/debug'
import { WalletContext } from '../../contexts/WalletContext'
import type { IProps } from './type'

import css from './index.module.css'

const FEE_TAGS = ['Slow', 'Avg', 'Fast']
const TAG = '[Fee_BTC]'

/**
 * Select baseFee and priorityFee
 *
 * @example
 *
 * userFee = `min(baseFee + priorityFee, maxFeePerGas)`
 */
export default function Btc(props: IProps) {
  const [loading, setLoading] = useState(true)
  const { currentNetwork } = useContext(WalletContext)!
  const [currentIndex, setCurrentIndex] = useState('0')
  // Bigint string, unit is wei
  const [baseFee, setBaseFee] = useState('')
  // Bigint string, unit is wei
  const [priorityFee, setPriorityFee] = useState('')
  // [ {title: string, fee: Bigint string} ]
  const [feeList, setFeeList] = useState<{title: string, fee: string}[] | null>(null)

  useEffect(() => {
    loadFees({
      network: currentNetwork
    })

    // Reload fees
    SimpleEvent.getInstance().on(EVENT_REFRESH_FEE, loadFees)
    return () => {
      SimpleEvent.getInstance().removeListener(EVENT_REFRESH_FEE, loadFees)
    }
  }, [])

  const loadFees = async (e: {network: INetwork | null}) => {
    const { network } = e
    if(network === null) {
      return
    }

    try {
      setLoading(true)
      const service = ServiceFactory.getService(network.chainType)
      const data = await service.getRecommendTransactionFees(network.rpc)
      const baseFee = data.baseFee
      const priorityFees = data.priorityFees

      if(baseFee === '') {
        throw new Error('Invalid base fee')
      }
      log(TAG, 'fee loaded: ', {baseFee, priorityFees})

      const list: {title: string, fee: string}[] = []
      for(let i=0; i<priorityFees.length; i++) {
        list.push({
          title: FEE_TAGS[i],
          fee: BigInt(priorityFees[i]).toString()
        })
      }

      const bigIntBaseFee = BigInt(baseFee).toString()
      const bigintPriorityFee = list[0].fee

      setBaseFee(bigIntBaseFee)
      setPriorityFee(bigintPriorityFee)
      setFeeList(list)
      setLoading(false)

      props.onFeeChange({
        baseFee: bigIntBaseFee,
        priorityFee: bigintPriorityFee
      })
    } catch(e) {
      console.error('load fee failed: ', e)
      toast.error('Failed to obtain fee data, please refresh transaction fee.')
    }
  }

  const openCustomFee = () => {
    // Only switch the display, do not change the fee rate here
    setCurrentIndex('3')
  }

  const switchPriorityFee = (e: MouseEvent<HTMLButtonElement>) => {
    if(feeList === null) {
      return
    }
    let t = e.target as HTMLElement;
    if(t.nodeName.toLowerCase() !== 'button') {
      t = t.parentNode as HTMLElement
    }
    if(t.nodeName.toLowerCase() !== 'button') {
      return
    }

    const i = t.dataset.i;
    if(i) {
      const fee = feeList[Number(i)].fee
      setCurrentIndex(i)
      setPriorityFee(fee)

      props.onFeeChange({
        baseFee: baseFee,
        priorityFee: fee
      })
    }
  }

  const changePriorityFee = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    if(v === '') {
      return
    }

    setPriorityFee(v)
    props.onFeeChange({
      baseFee: baseFee,
      priorityFee: v
    })
  }

  return (
    <div className={css.wrapper}>
      <div className={css.select}>
        {
          loading ? (
            <div className={css.placeholder}>
              <Skeleton />
            </div>
          ) : null
        }

        {
          loading ? null : (
            feeList?.map((item, index) => {
              return (
                <Button
                  key={item.title}
                  className={css.feeBtn}
                  data-i={index}
                  variant={Number(currentIndex) === index ? 'primary' : 'secondary'}
                  onClick={switchPriorityFee}
                >
                  <b>{item.title}</b>
                  <p>{item.fee} sat/VB</p>
                </Button>
              )
            })
          )
        }

        {
          loading ? null : (
            <Button
              data-i="3"
              variant={currentIndex === '3' ? 'primary' : 'secondary'}
              className={css.feeBtn}
              onClick={openCustomFee}
            >
              Custome
            </Button>
          )
        }
      </div>

      {
        currentIndex === '3' ? (
          <CustomFee
            baseFee={baseFee}
            priorityFee={priorityFee}
            changePriorityFee={changePriorityFee}
            network={currentNetwork}
          />
        ) : null
      }
    </div>
  )
}

function CustomFee(props: {
  baseFee: string,
  priorityFee: string,
  network: INetwork | null,
  changePriorityFee: (e: ChangeEvent<HTMLInputElement>) => void
}) {
  const { t } = useContext(I18nContext)!
  const { priorityFee, changePriorityFee } = props

  return (
    <div className={css.custom}>
      <div>
        <label className={css.customFeelabel}>{t('component.fee.label.priorityfee')}</label>
        <Input
          value={priorityFee}
          onChange={changePriorityFee}
          suffix={<span className={css.customFeeTip}>sat/VB</span>}
        />
      </div>
    </div>
  )
}

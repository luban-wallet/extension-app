import { useContext } from "react"
import { I18nContext } from "../../contexts/I18nContext"
import Button from "../button"
import SimpleEvent from "@lubankit/utils/SimpleEvent"
import { EVENT_REFRESH_FEE } from "../../configs/constant"
import IconRefresh from "../icons/refresh"
import { WalletContext } from "../../contexts/WalletContext"
import { FormItem } from "../form"
import FeeSelect from "../../components-oo/fee-select"

interface IProps {
  onFeeChange: (fee: {baseFee: string, priorityFee: string}) => void
}

export default function FeeWithRefresh(props: IProps) {
  const { t } = useContext(I18nContext)!
  const { currentNetwork } = useContext(WalletContext)!

  const refreshFee = () => {
    SimpleEvent.getInstance().emit(EVENT_REFRESH_FEE, {
      network: currentNetwork
    })
  }

  return (
    <FormItem
      label={t('page.send.sign.label.fee')}
      action={
        <Button variant='ghost' style={{ width: '24px', height: '24px' }} onClick={refreshFee}>
          <IconRefresh width={16} hanging={16} />
        </Button>
      }
    >
      <FeeSelect onFeeChange={props.onFeeChange} />
    </FormItem>
  )
}

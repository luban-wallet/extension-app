import SimpleEvent from "@lubankit/utils/SimpleEvent"
import { useContext } from "react"
import { WalletContext } from "../../../../contexts/WalletContext"
import Button from "../../../../components/button"
import IconRefresh from "../../../../components/icons/refresh"
import { EVENT_REFRESH_BALANCE } from "../../../../configs/constant"

export default function Refresh() {
  const { currentAccount, currentNetwork } = useContext(WalletContext)!

  const refresh = () => {
    SimpleEvent.getInstance().emit(EVENT_REFRESH_BALANCE, {
      network: currentNetwork,
      account: currentAccount
    })
  }

  return (
    <Button variant='ghost' style={{width: '32px', height: '32px'}} onClick={refresh}>
      <IconRefresh width={20} height={20} />
    </Button>
  )
}

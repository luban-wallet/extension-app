import { useContext } from "react";
import Button from "../../components/button";
import IconRefresh from "../../components/icons/refresh";
import { EVENT_REFRESH_BALANCE } from "../../configs/constant";
import SimpleEvent from "@lubankit/utils/SimpleEvent";
import { WalletContext } from "../../contexts/WalletContext";

export default function Btc() {
  const { currentAccount, currentNetwork } = useContext(WalletContext)!

  const refresh = () => {
    SimpleEvent.getInstance().emit(EVENT_REFRESH_BALANCE, {
      network: currentNetwork,
      account: currentAccount
    })
  }

  return (
    <Button variant='ghost' style={{width: '28px', height: '28px'}} onClick={refresh}>
      <IconRefresh width={18} hanging={18} />
    </Button>
  )
}

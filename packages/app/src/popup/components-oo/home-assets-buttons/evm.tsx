import { useContext } from "react";
import Button from "../../components/button";
import IconAdd from "../../components/icons/add";
import IconRefresh from "../../components/icons/refresh";
import LinkButton from "../../components/link-button";
import { EVENT_REFRESH_BALANCE } from "../../configs/constant";
import SimpleEvent from "@lubankit/utils/SimpleEvent";
import { WalletContext } from "../../contexts/WalletContext";

export default function Evm() {
  const { currentAccount, currentNetwork } = useContext(WalletContext)!

  const refresh = () => {
    SimpleEvent.getInstance().emit(EVENT_REFRESH_BALANCE, {
      network: currentNetwork,
      account: currentAccount
    })
  }

  return (
    <>
      <Button variant='ghost' style={{width: '28px', height: '28px'}} onClick={refresh}>
        <IconRefresh width={18} hanging={18} />
      </Button>
      <LinkButton style={{width: '28px', height: '28px'}} to="/home/token-add">
        <IconAdd width={18} hanging={18} />
      </LinkButton>
    </>
  )
}

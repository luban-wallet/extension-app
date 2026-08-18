import { useContext } from "react"
import ActionButton from "./action-button"
import { I18nContext } from "../../contexts/I18nContext"
import IconReceive from "../../components/icons/receive"
import IconSend from "../../components/icons/send"
import IconList from "../../components/icons/list"
// import IconCoin from "../../components/icons/coin"

export default function Btc() {
  const { t } = useContext(I18nContext)!

  return (
    <div style={{height: '100%', display: 'flex', justifyContent: 'space-around'}}>
      <ActionButton
        icon={<IconSend width={20} height={20} />}
        label={t('page.home.panel.btn.send')}
        to="/home/send-coin"
      />
      <ActionButton
        icon={<IconReceive width={20} height={20} />}
        label={t('page.home.panel.btn.receive')}
        to="/home/receive"
      />
      <ActionButton
        icon={<IconList width={20} height={20} />}
        label={t('page.home.panel.btn.activity')}
        to="/home/activities"
      />
      {/* <ActionButton
        icon={<IconCoin width={20} height={20} />}
        label={t('page.home.panel.btn.utxos')}
        to="/home/utxos"
      /> */}
    </div>
  )
}

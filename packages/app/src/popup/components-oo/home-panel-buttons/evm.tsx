import { useContext } from "react"
import ActionButton from "./action-button"
import { I18nContext } from "../../contexts/I18nContext"
import IconList from "../../components/icons/list"
import { IconIn, IconOut } from "../../components/icons/inout"
import IconClear from "../../components/icons/clear"

export default function Evm() {
  const { t } = useContext(I18nContext)!

  return (
    <div style={{height: '100%', display: 'flex', justifyContent: 'space-around'}}>
      <ActionButton
        icon={<IconOut width={20} height={20} />}
        label={t('page.home.panel.btn.send')}
        to="/home/send-coin"
      />
      <ActionButton
        icon={<IconIn width={20} height={20} />}
        label={t('page.home.panel.btn.receive')}
        to="/home/receive"
      />
      <ActionButton
        icon={<IconClear width={20} height={20} />}
        label={t('page.home.panel.btn.sendall')}
        to="/home/send-coin-all"
      />
      <ActionButton
        icon={<IconList width={20} height={20} />}
        label={t('page.home.panel.btn.activity')}
        to="/home/activities"
      />
    </div>
  )
}

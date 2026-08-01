import { useContext } from "react"
import { useNavigate } from "react-router"
import Button from "../../../../components/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../../../../components/dropdown-menu"
import IconMenu from "../../../../components/icons/menu"
import IconRight from "../../../../components/icons/right"
import IconSafe from "../../../../components/icons/safe"
import IconSetting from "../../../../components/icons/setting"
import IconExpand from "../../../../components/icons/expand"
import IconLogout from "../../../../components/icons/logout"
import { I18nContext } from "../../../../contexts/I18nContext"
import MsgHelper from "../../../../helpers/MsgHelper"
import NavHelper from "../../../../helpers/NavHelper"

import css from "./index.module.css"

export default function Setting() {
  const nav = useNavigate()
  const { t } = useContext(I18nContext)!

  const goFull = () => {
    NavHelper.nav(nav, '/home')
  }
  const goBackup = () => {
    nav('/home/settings/backup')
  }
  const goSettings = () => {
    nav('/home/settings')
  }
  const goUnlock = async () => {
    await MsgHelper.lock()
    nav('/unlock')
  }

  const list = [
    {
      id: 1,
      type: 1,
      icon: <IconExpand width={18} height={18} />,
      label: t('page.home.panel.setting.expand'),
      onSelect: goFull
    },
    {
      id: 2,
      type: 1,
      icon: <IconSafe width={18} height={18} />,
      label: t('page.home.panel.setting.backup'),
      onSelect: goBackup
    },
    {
      id: 3,
      type: 1,
      icon: <IconSetting width={18} height={18} />,
      label: t('page.home.panel.setting.settings'),
      onSelect: goSettings
    }
  ]

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className={css.wrapper}>
            <IconMenu width={24} height={24} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" alignOffset={-12}>
          {
            list.map((item) => (
              <DropdownMenuItem key={item.id} onSelect={item.onSelect}>
                {item.icon}
                <span>{item.label}</span>
                <div className={css.rightIcon}>
                  <IconRight width={20} height={20} />
                </div>
              </DropdownMenuItem>
            ))
          }
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={goUnlock}>
            <IconLogout width={18} height={18} />
            <span>{t('page.home.panel.setting.lock')}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

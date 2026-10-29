import { useContext } from "react"
import { useNavigate } from "react-router"
import Button from "../../../../components/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../../../../components/dropdown-menu"
import IconMenu from "../../../../components/icons/menu"
import IconRight from "../../../../components/icons/right"
import IconSafe from "../../../../components/icons/safe"
import IconSetting from "../../../../components/icons/setting"
import IconLock from "../../../../components/icons/lock"
import { I18nContext } from "../../../../contexts/I18nContext"
import MsgHelper from "../../../../helpers/MsgHelper"

import css from "./index.module.css"

export default function Setting() {
  const nav = useNavigate()
  const { t } = useContext(I18nContext)!

  const lock = async () => {
    await MsgHelper.lock()
    nav('/unlock')
  }

  const list = [
    {
      id: 1,
      type: 1,
      icon: <IconSafe width={18} height={18} />,
      label: t('page.home.panel.setting.backup'),
      onSelect: () => nav('/home/settings/backup')
    },
    {
      id: 2,
      type: 1,
      icon: <IconSetting width={18} height={18} />,
      label: t('page.home.panel.setting.settings'),
      onSelect: () => nav('/home/settings')
    }
  ]

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className={css.wrapper}>
            <IconMenu width={20} height={20} />
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
          <DropdownMenuItem onSelect={lock}>
            <IconLock width={18} height={18} />
            <span>{t('page.home.panel.setting.lock')}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

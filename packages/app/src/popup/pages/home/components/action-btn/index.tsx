import { useContext } from "react"
import { I18nContext } from "../../../../contexts/I18nContext"
import Button from "../../../../components/button"
import IconMore from "../../../../components/icons/more"
import IconEdit from "../../../../components/icons/edit"
import IconDelete from "../../../../components/icons/delete"

import css from './index.module.css'

export default function ActionBtn<T>(props: {
  canDel: boolean,
  data: T,
  onEdit: (data: T) => void,
  onDel: (data: T) => void
}) {
  const { t } = useContext(I18nContext)!

  const edit = () => {
    props.onEdit(props.data)
  }

  const del = () => {
    props.onDel(props.data)
  }

  return (
    <Button variant='ghost' className={css.more} >
      <IconMore width={18} hanging={18} />
      <ul className={css.menu}>
        <li className={css.menuItem} onClick={edit}>
          <IconEdit width={14} hanging={14} />
          <span>{t('page.settings.account.edit.text.edit')}</span>
        </li>
        {
          props.canDel ? (
          <li className={css.menuItem} onClick={del}>
            <IconDelete width={14} hanging={14} />
            <span>{t('page.settings.account.edit.text.delete')}</span>
          </li>
          ) : null
        }
      </ul>
    </Button>
  )
}
import { Link } from 'react-router'
import IconRight from '../icons/right'

import css from './index.module.css'

export default function LinkGroup(props: {className?: string, children?: React.ReactNode}) {
  const { className = '', children = null } = props
  return (
    <div className={css.group + ' ' + className}>
      {children}
    </div>
  )
}

interface LinkItemProps {
  link: string
  icon?: React.ReactNode
  label: string
  slot?: React.ReactNode
  showArrow?: boolean
}
export function LinkItem(props: LinkItemProps) {
  return (
    <Link
      to={props.link}
      className={css.linkItem}
    >
      <div className={css.linkItemContent}>
        <div className={css.linkItemLeft}>
          {props.icon && props.icon}
          <span>{props.label}</span>
        </div>
        <div className={css.linkItemRight}>
          {props.slot}
          {props.showArrow && <IconRight width={20} height={20} />}
        </div>
      </div>
    </Link>
  )
}
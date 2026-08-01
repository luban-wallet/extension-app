import { Link } from "react-router"

import css from './index.module.css'

interface IProps {
  to: string
  children: React.ReactNode
  className?: string
  variant?: 'button'
  target?: React.HTMLAttributeAnchorTarget
  style?: React.CSSProperties
}

export default function LinkButton(props: IProps) {
  const { to, children, className = '', variant = '', ...others } = props
  return (
    <Link to={to} className={css.link + ' ' + className} data-variant={variant} {...others}>{children}</Link>
  )
}

import type { PropsWithChildren } from 'react'
import Warn from '../icons/warn'

import css from './index.module.css'

interface IProps extends PropsWithChildren {
  type?: 'info' | 'warning' | 'error' | 'success'
}
export default function Alert(props: IProps) {
  return (
    <div className={css.wrapper}>
      <div className={css.icon}>
        <Warn />
      </div>
      <div className={css.content}>
        {props.children}
      </div>
    </div>
  )
}
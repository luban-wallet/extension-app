import { useNavigate } from 'react-router'
import IconBack from '../icons/back'

import css from './header.module.css'
import Button from '../button'

export default function Pageheader(props: {title?: string, showBack?: boolean, slot?: React.ReactNode}) {
  const {title, showBack = true} = props
  const nav = useNavigate()

  const goBack = () => {
    nav(-1)
  }

  return (
    <header className={css.wrapper}>
      {
        showBack ? (
          <Button variant="ghost" className={css.back} onClick={goBack}>
            <IconBack className={css.backIcon}/>
          </Button>
        ) : null
      }
      <div className={css.title}>{title}</div>
      {
        props.slot ? (
          <div className={css.slot}>
            {props.slot}
          </div>
        ) : null
      }
    </header>
  )
}

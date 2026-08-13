import { useState } from 'react'
import IconEye, { IconEyeClose } from '../icons/eye'

import css from './css.module.css'

interface IProps {
  suffix?: React.ReactNode
}

export default function Input(props: IProps & React.ComponentProps<"input">) {
  const { suffix = null, className = '', type, ...others } = props
  const [show, setShow] = useState(false)

  const toggle = () => {
    setShow(!show)
  }

  const actualType = type === 'password' ? (show ? 'text' : 'password') : type

  return (
    <div className={css.wrapper}>
      <input
        type={actualType}
        className={css.input + ' ' + className}
        {...others}
      />
      <div className={css.suffix}>
        {suffix}
        {
          type === 'password' ? <span onClick={toggle}>{show ? <IconEyeClose /> : <IconEye />}</span> : null
        }
      </div>
    </div>
  )
}

export function Textarea(props: React.ComponentProps<"textarea">) {
  return (
    <div className={css.textareaWrapper}>
      <textarea className={css.textarea} {...props} />
    </div>
  )
}

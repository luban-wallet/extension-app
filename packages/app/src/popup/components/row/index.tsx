import css from './css.module.css'

interface IProps {
  label: string
  children?: React.ReactNode
}

export default function Row(props: IProps) {
  const { label, children } = props
  return (
    <div className={css.wrapper}>
      <div className={css.label}>{label}</div>
      <div className={css.detail}>{children}</div>
    </div>
  )
}

import css from './index.module.css'

export default function Empty(props: {children: React.ReactNode}) {
  return (
    <div className={css.wrapper}>
      <img alt="empty" src="/images/empty.svg" width="64" height="64" />
      <p className={css.info}>{props.children}</p>
    </div>
  )
}
import css from './index.module.css'

export default function Tag(props: {children: React.ReactNode}) {
  return (
    <span className={css.wrapper}>{props.children}</span>
  )
}
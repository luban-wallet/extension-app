import css from './footer.module.css'

export default function Footer(props: {children?: React.ReactNode}) {
  return (
    <footer className={css.wrapper}>
      <div className={css.content}>{props.children}</div>
    </footer>
  )
}

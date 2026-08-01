import css from './index.module.css'

interface IProps {
  current: string
  list: string[]
}

export default function TextTab(props: IProps) {
  const { current, list } = props
  return (
    <ul className={css.wrapper}>
      {
        list.map((item) => (
          <li key={item} className={css.item + ' ' + (current === item ? css.active : '')}>
            {item}
          </li>
        ))
      }
    </ul>
  )
}
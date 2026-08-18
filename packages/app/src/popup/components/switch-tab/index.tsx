import Button from '../button'
import css from './index.module.css'

export type SwitchItem = {
  label: string
  value: number
}
interface IProps {
  value: number
  items: SwitchItem[],
  onChange?: (item: SwitchItem) => void
}
export default function SwitchTab(props: IProps) {
  const { value, items } = props

  const changeTab = (e: React.MouseEvent<HTMLButtonElement>) => {
    const index = e.currentTarget.dataset.index
    if(index === undefined) {
      return
    }

    const item = items[Number(index)]
    props.onChange?.(item)
  }

  return (
    <div className={css.wrapper}>
      {
        items.map((item, index) => (
          <Button
            key={item.value}
            className={css.btn + ' ' + (value === item.value ? css.active : '')}
            data-index={index}
            onClick={changeTab}
          >{item.label}</Button>
        ))
      }
    </div>
  )
}

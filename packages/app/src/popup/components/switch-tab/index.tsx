import Button from '../button'
import css from './index.module.css'

export type SwitchItem = {
  label: string
  value: number
}
interface IProps {
  value: number
  values: SwitchItem[],
  onChange?: (item: SwitchItem) => void
}
export default function SwitchTab(props: IProps) {
  const { value, values } = props

  const changeTab = (e: React.MouseEvent<HTMLButtonElement>) => {
    const index = e.currentTarget.dataset.index
    if(index === undefined) {
      return
    }

    const item = values[Number(index)]
    props.onChange?.(item)
  }

  return (
    <div className={css.wrapper}>
      {
        values.map((item, index) => (
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
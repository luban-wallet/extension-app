import css from './step.module.css'

interface IProps {
  total: number
  current: number
}

export default function Step(props: IProps) {
  return (
    <div className={css.wrapper}>
      {
        new Array(props.total).fill(0).map((_, index) => (
          <div key={index} data-active={props.current >= index} className={css.item} />
        ))
      }
    </div>
  )
}

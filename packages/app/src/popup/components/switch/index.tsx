import Button from '../button'

import css from './index.module.css'

interface IProps {
  onCheckedChange: (checked: boolean) => void
  checked: boolean
}

const styles = {
  '--switch-width': '44px',
  '--switch-height': '24px',
} as Record<string, string>

export default function Switch(props: IProps) {
  const change = () => {
    const newChecked = !props.checked
    props.onCheckedChange(newChecked)
  }

  return (
    <Button
      data-state={props.checked ? 'checked' : 'unchecked'}
      style={styles}
      className={css.wrapper} variant='primary'
      onClick={change}
    >
      <span className={css.btn} />
    </Button>
  )
}

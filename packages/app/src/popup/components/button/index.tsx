import Loading from '../loading'
import css from './css.module.css'

type ButtonType = React.ComponentPropsWithoutRef<'button'> & {
  loading?: boolean
  variant?: 'link' | 'primary' | 'secondary' | 'ghost'
  children: React.ReactNode
}

export default function Button({ loading = false, className = '', type = 'button', variant = 'secondary', children, ...props }: ButtonType) {
  return (
    <button
      type={type}
      data-variant={variant}
      className={css.button + ' ' + className}
      {...props}
    >
      {loading ? <Loading size={16} /> : null}
      {children}
    </button>
  )
}
Button.displayName = 'Button';
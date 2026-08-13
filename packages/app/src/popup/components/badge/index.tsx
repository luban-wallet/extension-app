const typeStyle = {
  default: {
    height: '18px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: 'rgb(var(--color-background-0))',
    color: 'rgb(var(--color-typography-900))',
    fontSize: '12px',
    padding: '0 8px',
  },
  failed: {
    color: 'rgb(var(--color-error-900))',
    backgroundColor: 'rgb(var(--color-background-error))',
  },
  success: {
    color: 'rgb(var(--color-success-900))',
    backgroundColor: 'rgb(var(--color-background-success))',
  }
}

export default function Badge(props: { type?: 'default' | 'success' | 'failed', children: React.ReactNode }) {
  const type = props.type ?? 'default'
  const style = {...typeStyle.default, ...typeStyle[type]}
  return (
    <span style={style}>{props.children}</span>
  )
}

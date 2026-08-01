const style = {
  height: '18px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 'var(--radius-sm)',
  backgroundColor: 'rgb(var(--color-background-0))',
  color: 'rgb(var(--color-typography-900))',
  fontSize: '12px',
  padding: '0 8px',
}

export default function Badge(props: { children: React.ReactNode }) {
  return (
    <span style={style}>{props.children}</span>
  )
}

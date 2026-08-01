export default function Divider(props: { space?: boolean }) {
  const { space = false } = props
  return (
    <div style={{
      height: '1px',
      backgroundColor: 'rgb(var(--color-background-500))',
      margin: !space ? '0 0' : '20px 0'
    }} />
  )
}

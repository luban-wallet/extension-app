export default function Success(props: { msg?: string }) {
  const { msg = '' } = props

  return (
    <div>
      <div id="success_container" style={{ width: '60px', height: '60px', margin: '0 auto' }}>
        <img src="/images/success100.svg" />
      </div>
      <p style={{ fontSize: '15px', marginTop: '20px', padding: '0 16px', textAlign: 'center' }}>{msg}</p>
    </div>
  )
}

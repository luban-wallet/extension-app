import { useState } from "react"
import IconHelp from "../../../../../components/icons/help"
import Button from "../../../../../components/button"

export default function Tip() {
  const [show, setShow] = useState(false)

  return (
    <div style={{position: 'relative', width: '40px', flexShrink: 0, display: 'flex', alignItems: 'center'}}>
      <Button
        variant="ghost"
        style={{width: '28px', height: '28px', borderRadius: 'var(--radius)'}}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        <IconHelp width={18} height={18} />
      </Button>

      <div
        style={{
          display: show ? 'block' : 'none',
          position: 'absolute',
          zIndex: 100,
          bottom: '32px',
          left: '0',
          width: '200px',
          padding: '12px',
          backgroundColor: 'rgb(var(--color-background-700))',
          borderRadius: 'var(--radius)'
        }}
      >
        <h4>Only send records?</h4>
        <p style={{fontSize: '12px', marginTop: '8px'}}>Yes, But if a suitable free API is found, changes will be made here.</p>
      </div>
    </div>
  )
}

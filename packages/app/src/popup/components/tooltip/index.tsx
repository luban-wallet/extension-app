import type { ReactNode } from "react"

const style = {
  position: 'absolute' as const,
  zIndex: 4001,
  left: '50%',
  top: '40px',
  width: '240px',
  padding: '12px 12px',
  transform: 'translateX(-50%)',
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'rgb(var(--color-background-0))',
}

export default function Tooltip(props: {children: ReactNode}) {
  return (
    <div data-role="tooltip" style={style}>
      {props.children}
    </div>
  )
}

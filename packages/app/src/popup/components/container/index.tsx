export default function Container({ footer = false, children }: { footer?: boolean, children: React.ReactNode }) {
  return (
    <div style={{ margin: `12px 16px 0 16px`, paddingBottom: footer ? '100px' : '0' }}>
      {children}
    </div>
  )
}

export function Title({ children, style = {} }: { children: React.ReactNode, style?: React.CSSProperties }) {
  return (
    <h4 style={{ lineHeight: '20px', fontSize: 14, fontWeight: 500, marginBottom: '12px', ...style }}>
      {children}
    </h4>
  )
}

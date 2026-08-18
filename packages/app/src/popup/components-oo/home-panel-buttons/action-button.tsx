import LinkButton from "../../components/link-button"

const wrapperStyle = {
  width: '72px',
  height: '100%',
  fontSize: '12px',
  borderRadius: 'var(--radius-lg)',
  color: 'rgb(var(--color-primary-500))',
  fontWeight: 500,
} as const

const innerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  rowGap: '8px',
} as const

interface IProps {
  label: string
  icon: React.ReactNode
  to: string
}

export default function ActionButton(props: IProps) {
  return (
    <LinkButton variant="button" style={wrapperStyle} to={props.to}>
      <div style={innerStyle}>
        {props.icon}
        <p>{props.label}</p>
      </div>
    </LinkButton>
  )
}

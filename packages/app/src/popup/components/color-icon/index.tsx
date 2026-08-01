import { getColor } from "../../utils/util"

interface IProps {
  name?: string
  size: number
  font?: number
  url?: string
}

export default function ColorIcon(props: IProps) {
  const { size, name = '', font = 14, url = '' } = props

  const A = name?.length > 0 ? name[0] : ''
  const color = getColor(name)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: `${font}px`,
        fontWeight: 500,
        borderRadius: '50%',
        color: '#fff',
        backgroundColor: url === '' ? color : '#fff',
        width: `${size}px`,
        height: `${size}px`,
        overflow: 'hidden',
      }}
      title={name}
    >
      {url === '' ? (
        <span>{A}</span>
      ) : (
        <img style={{width: '100%', height: '100%'}} src={url} />
      )}
    </div>
  )
}

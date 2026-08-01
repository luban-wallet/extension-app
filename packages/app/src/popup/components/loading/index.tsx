import IconLoading from "../icons/loading"

interface IProps {
  size?: number
}

export default function Loading(props: IProps) {
  const { size = 72 } = props;
  return (
    <div
      style={{
        color: 'rgb(var(--color-typography-500))',
        width: `${size}px`, height: `${size}px`,
        animation: 'animate-spin 1s linear infinite'
      }}
    >
      <IconLoading width={size} height={size} />
    </div>
  )
}
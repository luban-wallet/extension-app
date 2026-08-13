export default function Skeleton(props: {style?: React.CSSProperties}) {
  const { style = {} } = props
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        borderRadius: 'var(--radius)',
        backgroundImage: 'linear-gradient(90deg, rgb(var(--color-background-0)) 25%, '
          + 'rgb(var(--color-background-200)) 50%, '
          + 'rgb(var(--color-background-0)) 100%)',
        // backgroundImage: 'linear-gradient(90deg, red 0%, '
        //   + 'green 50%, '
        //   + 'blue 100%)',
        backgroundSize: '300% 100%',
        backgroundPosition: '0% 0%',
        animation: 'animate-skeleton 1s linear infinite',
        ...style,
      }}
    />
  )
}
import { useEffect, useRef } from "react"
import Anim from '@luban/wallet-anim'

export default function HaloShader(props: {dark: boolean}) {
  const width = globalThis.innerWidth
  let height = width * 1
  height = Math.min(globalThis.innerHeight, height)
  
  const ref = useRef<Anim | null>(null)

  useEffect(() => {
    const theme = props.dark ? 0 : 1
    ref.current = new Anim()
    ref.current.initCanvas('shader_canvas', theme)
    
    return () => {
      ref.current?.stop()
    }
  }, [])

  return (
    <canvas id="shader_canvas" width={width} height={height} style={{position: 'absolute', zIndex: 1, top: 0, left: 0, pointerEvents: "none"}}></canvas>
  )
}

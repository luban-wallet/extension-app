import { useRef, useState } from 'react'

export default function useAsyncCallback<D, F extends (...args: unknown[]) => Promise<D>>(fun: F) {
  const ref = useRef(false)
  const [data, setData] = useState<D | null>(null)
  const [loading, setLoading] = useState(false)

  const execute = async (...args: Parameters<F>) => {
    if(ref.current) {
      return
    }
    ref.current = true

    try {
      setLoading(true)
      const res = await fun(...args)
      setData(res)
    } catch(e) {
      console.error(e)
    } finally {
      ref.current = false
      setLoading(false)
    }
  }

  return {
    loading,
    data,
    execute
  }
}

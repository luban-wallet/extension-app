import { useRef } from 'react'

export type ProviderRequestData = ReturnType<typeof usePR>
export type ProviderRequest = {
  metadata: {
    name: string
    description: string
    url: string
    icon: string
  },
  payload: unknown
}

export default function usePR() {
  const request = useRef<ProviderRequest | null>(null)

  return {
    request
  }
}

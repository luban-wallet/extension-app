import { useRef } from 'react'
import type { IToken } from '../configs/token'

export type TokenData = ReturnType<typeof useTokens>

export default function useTokens() {
  // {b_chainId_useraddress: balance}
  const cachedCoinBalances = useRef<Record<string, string | undefined>>({})
  // {chainId: IToken[]}
  const cachedTokens = useRef<Record<string, IToken[] | null | undefined>>({})
  // {b_tokenId_useraddress: balance}
  const cachedBalances = useRef<Record<string, string | undefined>>({})

  const getCachedCoinBalance = (chainId: string, userAddress: string): string | undefined => {
    const key = 'b_' + chainId + '_' + userAddress
    return cachedCoinBalances.current[key]
  }
  const setCachedCoinBalance = (chainId: string, userAddress: string, balance: string): void => {
    const key = 'b_' + chainId + '_' + userAddress
    cachedCoinBalances.current[key] = balance
  }

  const getCachedTokens = (chainId: string): IToken[] | null | undefined => {
    return cachedTokens.current[chainId]
  }
  const setCachedTokens = (chainId: string, tokens: IToken[] | null): void => {
    cachedTokens.current[chainId] = tokens
  }

  const getCachedBalance = (tokenId: number, userAddress: string): string | undefined => {
    const key = 'b_' + String(tokenId) + '_' + userAddress
    return cachedBalances.current[key]
  }
  const setCachedBalance = (tokenId: number, userAddress: string, balance: string): void => {
    const key = 'b_' + String(tokenId) + '_' + userAddress
    cachedBalances.current[key] = balance
  }

  return {
    getCachedCoinBalance,
    setCachedCoinBalance,
    getCachedTokens,
    setCachedTokens,
    getCachedBalance,
    setCachedBalance
  }
}

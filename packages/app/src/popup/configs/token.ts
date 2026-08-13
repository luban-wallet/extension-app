export interface IToken {
  id?: number
  icon?: string
  /** Contract address of the token */
  contract: string
  name: string
  symbol: string
  decimals: string
  totalSupply: string
  chainId: string
}

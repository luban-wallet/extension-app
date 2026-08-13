export interface ITransaction {
  id?: number
  from: string
  to: string
  name: string
  amount: string
  /** Contract address */
  contract: string
  chainId: string
  hash: string
  type: 'in' | 'out'
  status: '' | 'pending' | 'success' | 'failed'
  decimals: number
  timestamp: number
}

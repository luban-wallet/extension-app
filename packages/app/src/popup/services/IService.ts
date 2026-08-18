import type { IUTXO } from '../configs/utxo'

export default interface IService {
  /**
   * Executes a new message call
   */
  call(rpc: string, method: string, params: unknown): Promise<{result: unknown}>

  /**
   * Get coin balance of address
   */
  getCoinBalance(rpc: string, address: string): Promise<{available: string, unconfirmed: string, locked: string}>

  /**
   * Get the number of transactions sent from an address
   */
  getTransactionCount(rpc: string, address: string): Promise<string>

  /**
   * Submits a raw transaction (serialized and signed) for broadcasting to the network
   */
  sendRawTransaction(rpc: string, tx: string[]): Promise<string>

  /**
   * Get unit price of gas
   */
  // gasPrice(rpc: string): Promise<string>

  /**
   * Estimate gas limit for transaction
   */
  estimateGas(rpc: string, params: unknown[]): Promise<string>

  /**
   * Get three recommend fees in order of ASC
   */
  getRecommendTransactionFees(rpc: string): Promise<{baseFee: string, priorityFees: string[]}>

  /**
   * Get token metadata
   */
  getTokenMetadata(rpc: string, contract: string): Promise<{
    name: string
    symbol: string
    decimals: string
    totalSupply: string
  }>

  /**
   * Get token balance of address
   */
  getTokenBalance(rpc: string, contract: string, address: string): Promise<string>

  /**
   * Bitcoin only: Get the list of unspent transaction outputs (UTXOs) for a given address
   */
  getUnspentList(rpc: string, address: string): Promise<IUTXO[]>

  /**
   * Get the status of a transaction
   */
  getTransactionStatus(rpc: string, txHash: string): Promise<{status: 'pending' | 'success' | 'failed'}>
}

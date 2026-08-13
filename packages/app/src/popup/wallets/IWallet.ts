import type { INetwork } from "../configs/network"
import type { IToken } from "../configs/token"

/**
 * Wallet offline operations interface
 */
export default interface IWallet {
  /**
   * Create a wallet from mnemonic words
   *
   * @param {string} words The mnemonic words
   * @param {number} index The derivation index
   */
  create(words: string, index?: number): IWallet

  /**
   * Restore a wallet from cached data
   *
   * @param {string} password The password to decrypt the wallet
   * @param {number} index The derivation index
   */
  restore(password: string, index?: number): Promise<IWallet>

  /**
   * The wallet address
   */
  address(): string

  /**
   * Sign a transaction, returning the fully signed transaction
   *
   * @param {Record<string, unknown>} tx The transaction to sign
   */
  signTransaction(tx: BaseTransaction): Promise<string>

  /**
   * Sign a message, returning the signature
   *
   * @param {string} message The message to sign
   */
  signMessage(message: string): Promise<string>

  /**
   * Sign typed data, returning the signature
   */
  signTypedData(data: unknown): Promise<string>

  /**
   * Prepare a coin transfer transaction
   */
  prepareBaseCoinTransaction(network: INetwork, tx: BaseTransaction): Promise<BaseTransaction>
  prepareCoinTransaction(tx: BaseTransaction, metaData: {baseFee: string, feeUnitPrice: string}): Promise<BaseTransaction>

  /**
   * Prepare a token transfer transaction
   */
  prepareBaseTokenTransaction(network: INetwork, tx: BaseTransaction): Promise<BaseTransaction>
  prepareTokenTransaction(tx: BaseTransaction, metaData: {baseFee: string, feeUnitPrice: string}): Promise<BaseTransaction>

  encodeTokenTransfer(to: string, amount: string): string

  selectUtxos(feeRate: string, amount: string, unspent: unknown[]): Promise<{
    selected: unknown[],
    change: bigint,
    needChange: boolean
  }>
}

export interface BaseTransaction {
  from: string
  to: string
  /** `wei` or `sat` */
  value?: string

  /** Ethereum */
  nonce?: number
  type?: number
  /** A decimal chain id in ethereum or empty string */
  chainId?: string
  data?: string
  // EIP-1559 parameters
  gasLimit?: string
  maxPriorityFeePerGas?: string
  /**
   * `gasPrice = min(baseFee + maxPriorityFeePerGas, maxFeePerGas)`
   */
  maxFeePerGas?: string

  /** Bitcoin */
  /** Available UTXOs */
  unspent?: Array<{txid: string, vout: number, value: string}>
  /** Selected UTXOs */
  selected?: {
    selected: Array<{txid: string, vout: number, value: string}>
    change: bigint
    needChange: boolean
  }

  /** Others */
  contract?: IToken
}



import type IWallet from '../IWallet'
import { ethers } from 'ethers'
import Crypto, { type Keystore } from "@lubankit/crypto"
import { Storage } from "@luban/wallet-storage"
import { DERIVATION_PATHS } from '../../configs/account'
import { LOCAL_KEYSTORE } from '../../configs/constant'
import type { INetwork } from '../../configs/network'
import type { BaseTransaction } from '../IWallet'

export interface EthereumTransaction extends BaseTransaction {
  type: number
  /** A decimal chain id in ethereum or empty string */
  chainId: string
  value: string
  data: string

  // EIP-1559 parameters
  gasLimit: string
  maxPriorityFeePerGas: string
  /**
   * @example
   *
   * `gasPrice = min(baseFee + maxPriorityFeePerGas, maxFeePerGas)`
   */
  maxFeePerGas: string
}

/**
 * EVM HDNode Wallet implementation
 */
export default class Wallet implements IWallet {
  nativeWallet: ethers.HDNodeWallet | null = null

  public create(words: string, index: number = 0): IWallet {
    const path = DERIVATION_PATHS['EVM'] + index
    this.nativeWallet = ethers.HDNodeWallet.fromPhrase(words, '', path)
    return this
  }

  public async restore(password: string, index: number = 0): Promise<IWallet> {
    const vault = await Storage.getInstance<Keystore>('local').get(LOCAL_KEYSTORE)
    if(vault === null) {
      throw new Error('Wallet not saved')
    }

    const phrase = await Crypto.getInstance().decrypt(vault, password)
    if(phrase === null) {
      throw new Error('Restore wallet failed')
    }

    return this.create(phrase, index)
  }

  public address(): string {
    if(this.nativeWallet === null) {
      throw new Error('Wallet not created')
    }

    return this.nativeWallet.address
  }

  public async signTransaction(transaction: EthereumTransaction): Promise<string> {
    if(this.nativeWallet === null) {
      throw new Error('Wallet not created')
    }

    const payload = {
      type: transaction.type,
      from: transaction.from,
      to: transaction.to,
      value: transaction.value,
      data: transaction.data,
      chainId: transaction.chainId,
      nonce: transaction.nonce,
      gasLimit: transaction.gasLimit,
      maxPriorityFeePerGas: transaction.maxPriorityFeePerGas,
      maxFeePerGas: transaction.maxFeePerGas
    }

    return this.nativeWallet.signTransaction(payload)
  }

  public signMessage(message: string): Promise<string> {
    if(this.nativeWallet === null) {
      throw new Error('Wallet not created')
    }

    return this.nativeWallet.signMessage(message)
  }

  public signTypedData(data: {domain: unknown, types: unknown, message: unknown}): Promise<string> {
    if(this.nativeWallet === null) {
      throw new Error('Wallet not created')
    }

    // @ts-expect-error todo
    return this.nativeWallet.signTypedData(data.domain, data.types, data.message)
  }

  public async prepareBaseCoinTransaction(network: INetwork, transaction: BaseTransaction): Promise<EthereumTransaction> {
    return {
      type: 2,
      from: transaction.from,
      to: transaction.to,
      nonce: transaction.nonce,
      chainId: network.chainId,
      value: '0x0',
      // Coin transaction has no data
      data: '0x',
      gasLimit: '0',
      maxPriorityFeePerGas: '',
      maxFeePerGas: '',
    }
  }

  public async prepareCoinTransaction(transaction: EthereumTransaction, metaData: {baseFee: string, feeUnitPrice: string}): Promise<EthereumTransaction> {
    transaction.maxPriorityFeePerGas = metaData.feeUnitPrice
    transaction.maxFeePerGas = (BigInt(metaData.baseFee) + BigInt(metaData.feeUnitPrice)).toString()

    if(BigInt(transaction.value) === 0n) {
      throw new Error('Value is required for coin transaction')
    }
    if(BigInt(transaction.gasLimit) === 0n) {
      throw new Error('Gas limit is required for coin transaction')
    }

    return transaction
  }

  public async prepareBaseTokenTransaction(network: INetwork, transaction: BaseTransaction): Promise<EthereumTransaction> {
    if(transaction.contract === undefined) {
      throw new Error('Contract address is required for token transaction')
    }

    return {
      type: 2,
      from: transaction.from,
      to: transaction.to,
      nonce: transaction.nonce,
      chainId: network.chainId,
      value: transaction.value ?? '0x0',
      data: '0x',
      gasLimit: '0',
      maxPriorityFeePerGas: '',
      maxFeePerGas: '',

      contract: transaction.contract,
    }
  }

  public async prepareTokenTransaction(transaction: EthereumTransaction, fees: {baseFee: string, feeUnitPrice: string}): Promise<EthereumTransaction> {
    const data = this.encodeTokenTransfer(transaction.to, transaction.value)

    // Token transaction has no value
    transaction.value = '0x0'
    transaction.data = data
    transaction.maxPriorityFeePerGas = fees.feeUnitPrice
    transaction.maxFeePerGas = (BigInt(fees.baseFee) + BigInt(fees.feeUnitPrice)).toString()

    // Remove unused fields
    delete transaction.contract

    if(BigInt(transaction.gasLimit) === 0n) {
      throw new Error('Gas limit is required for token transaction')
    }

    return transaction
  }

  public encodeTokenTransfer(to: string, amount: string): string {
    // ERC20 transfer function signature: `transfer(address,uint256)`
    const abiCoder = new ethers.AbiCoder()
    let encodedParam = abiCoder.encode(['address', 'uint256'], [to, amount])
    if(encodedParam.startsWith('0x')) {
      encodedParam = encodedParam.substring(2)
    }

    return '0xa9059cbb' + encodedParam
  }

  public selectUtxos(): Promise<{
    selected: unknown[],
    change: bigint,
    needChange: boolean
  }> {
    throw new Error('selectUtxos is not supported for EVM wallets')
  }
}

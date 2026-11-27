import type IWallet from '../IWallet'
import Crypto, { type Keystore } from "@lubankit/crypto"
import { Storage } from "@luban/wallet-storage"
import { mnemonicToSeedSync } from 'bip39'
import { derivePath, getPublicKey } from 'ed25519-hd-key'
import {
  address,
  appendTransactionMessageInstruction,
  createKeyPairFromPrivateKeyBytes,
  createSignerFromKeyPair,
  createSignableMessage,
  createTransactionMessage,
  getBase58Decoder,
  setTransactionMessageConfig,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
  getBase64EncodedWireTransaction,
  estimateResourceLimitsFactory,
  createSolanaRpc,
  estimateAndSetResourceLimitsFactory,
} from '@solana/kit'
import {
  getTransferSolInstruction,
} from '@solana-program/system'
import type {
  KeyPairSigner,
  TransactionMessage,
  TransactionMessageWithFeePayer,
  TransactionMessageWithSigners
} from '@solana/kit'
import { DERIVATION_PATHS } from '../../configs/account'
import { LOCAL_KEYSTORE } from '../../configs/constant'
import type { INetwork } from '../../configs/network'
import type { BaseTransaction, FeeMeta } from '../IWallet'
import type { SomeRequired } from '../../utils/type'

export type SolanaTransaction = SomeRequired<BaseTransaction, 'value'>

/**
 * Solana (SVM) HD wallet implementation
 */
export default class Wallet implements IWallet {
  network: INetwork
  nativeWallet: { privateKey: Uint8Array } | null = null
  transactionMessage: TransactionMessage | null = null

  constructor(network: INetwork) {
    this.network = network
  }

  private async getSigner(): Promise<KeyPairSigner> {
    if(this.nativeWallet === null) {
      throw new Error('Wallet not created')
    }

    const keyPair = await createKeyPairFromPrivateKeyBytes(this.nativeWallet.privateKey)
    return await createSignerFromKeyPair(keyPair)
  }

  public create(words: string, index: number = 0): IWallet {
    const path = DERIVATION_PATHS.SVM.replace('{i}', BigInt(index).toString())
    const seedHex = mnemonicToSeedSync(words)
    const { key } = derivePath(path, seedHex.toString('hex'))
    this.nativeWallet = { privateKey: key }
    return this
  }

  public async restore(password: string, index: number = 0): Promise<IWallet> {
    const vault = await Storage.getInstance<Keystore>('local').get(LOCAL_KEYSTORE)
    if(vault === null) {
      throw new Error('Wallet not saved')
    }

    const phrase = await Crypto.getInstance().decrypt(vault, password)
    if(phrase === '') {
      throw new Error('Restore wallet failed')
    }

    return this.create(phrase, index)
  }

  public address(): string {
    if(this.nativeWallet === null) {
      throw new Error('Wallet not created')
    }

    const publicKey = getPublicKey(this.nativeWallet.privateKey, false)
    return getBase58Decoder().decode(publicKey)
  }

  public async signTransaction(): Promise<string> {
    if(this.transactionMessage === null) {
      throw new Error('Transaction message not prepared')
    }

    const message = this.transactionMessage as TransactionMessage & TransactionMessageWithFeePayer & TransactionMessageWithSigners
    const signedTransaction = await signTransactionMessageWithSigners(message)
    const base64Tx = getBase64EncodedWireTransaction(signedTransaction)

    return base64Tx
  }

  public async signMessage(message: string): Promise<string> {
    const signer = await this.getSigner()
    const [signatures] = await signer.signMessages([createSignableMessage(message)])

    const bytes = signatures[signer.address]
    if(bytes === undefined) {
      throw new Error('Sign message failed')
    }

    return getBase58Decoder().decode(bytes)
  }

  public async signTypedData(): Promise<string> {
    throw new Error('signTypedData is not supported for SVM wallets')
  }

  public async prepareSweepBaseCoinTransaction(): Promise<SolanaTransaction> {
    throw new Error('prepareSweepBaseCoinTransaction is not implemented')
  }

  public async prepareSweepCoinTransaction(): Promise<SolanaTransaction> {
    throw new Error('prepareSweepCoinTransaction is not implemented')
  }

  public async prepareBaseCoinTransaction(transaction: BaseTransaction): Promise<SolanaTransaction> {
    return {
      from: transaction.from,
      to: transaction.to,
      value: '',
    }
  }

  public async prepareCoinTransaction(transaction: SolanaTransaction, metaData: FeeMeta): Promise<SolanaTransaction> {
    if(transaction.value === '') {
      throw new Error('Value is required for coin transaction')
    }

    const rpc = createSolanaRpc(this.network.rpc)
    const keyPair = await this.getSigner()
    const blockHash = await rpc.getLatestBlockhash().send()

    // 1. Create a new transaction message for the coin transaction
    const message1 = createTransactionMessage({ version: 1 })
    const message2 = setTransactionMessageLifetimeUsingBlockhash(blockHash.value, message1)
    const message3 = setTransactionMessageFeePayerSigner(keyPair, message2)
    const message4 = appendTransactionMessageInstruction(getTransferSolInstruction({
      source: keyPair,
      destination: address(transaction.to),
      amount: BigInt(transaction.value),
    }), message3)
    const message5 = setTransactionMessageConfig({
      // computeUnitLimit: 200_000,
      // loadedAccountsDataSizeLimit: 64 * 1024,
      // Here we use the feeUnitPrice as the priority fee for the transaction
      priorityFeeLamports: BigInt(metaData.feeUnitPrice)
    }, message4)

    // 2. Estimate computeUnitLimit and loadedAccountsDataSizeLimit
    const estimator = estimateResourceLimitsFactory({ rpc })
    const estimateAndSet = estimateAndSetResourceLimitsFactory(estimator)
    const finalMessage = await estimateAndSet(message5)

    this.transactionMessage = finalMessage
    return transaction
  }

  public async prepareBaseTokenTransaction(): Promise<SolanaTransaction> {
    throw new Error('prepareBaseTokenTransaction is not implemented')
  }

  public async prepareTokenTransaction(): Promise<SolanaTransaction> {
    throw new Error('prepareTokenTransaction is not implemented')
  }

  public encodeTokenTransfer(): string {
    throw new Error('Method not implemented.')
  }
}

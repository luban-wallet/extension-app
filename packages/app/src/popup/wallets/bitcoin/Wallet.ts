import type { ChainType, INetwork } from '../../configs/network'
import type IWallet from '../IWallet'
import { BIP32Factory, type BIP32Interface } from 'bip32'
import { mnemonicToSeedSync } from 'bip39'
import { crypto, initEccLib, networks, payments, Psbt } from 'bitcoinjs-lib'
import * as ecc from '@bitcoinerlab/secp256k1'
import { DERIVATION_PATHS } from '../../configs/account'
import { Storage } from "@luban/wallet-storage"
import Crypto, { type Keystore } from "@lubankit/crypto"
import { BITCOIN_DUST_RELAY_SATS, LOCAL_KEYSTORE } from '../../configs/constant'
import ServiceFactory from '../../services/ServiceFactory'
import type { BaseTransaction } from '../IWallet'
import { ECPairFactory } from 'ecpair'

export interface BitcoinTransaction extends BaseTransaction {
  unspent: Array<{txid: string, vout: number, value: string}>
}

export interface BitcoinUtxo {
  txid: string
  vout: number
  value: string
}

/**
 * Bitcoin wallet implementation
 */
export default class Wallet implements IWallet {
  chainType: ChainType
  nativeWallet: {p2tr: payments.Payment, child: BIP32Interface} | null = null

  constructor(chainType: ChainType) {
    this.chainType = chainType
  }

  static schnorrValidator(pubkey: Uint8Array, msgHash: Uint8Array, signature: Uint8Array): boolean {
    return ecc.verifySchnorr(msgHash, pubkey, signature);
  }

  static getBitcoinNetwork(chainType: ChainType): networks.Network {
    if(chainType === 'BITCOIN') {
      return networks.bitcoin
    }

    if(chainType === 'BITCOIN_TESTNET') {
      return networks.testnet
    }

    return networks.regtest
  }

  /**
   * Select UTXOs for a Bitcoin transaction
   *
   * @param network
   * @param feeRate
   * @param amount sat amount
   * @param list available UTXOs
   */
  public async selectUtxos(feeRate: string, amount: string, unspent: BitcoinUtxo[]): Promise<{
    selected: BitcoinUtxo[],
    change: bigint,
    needChange: boolean
  }> {
    const service = ServiceFactory.getService(this.chainType)

    // Sort utxos by value ascending
    const sorted = unspent.sort((a, b) => BigInt(a.value) - BigInt(b.value) >= 0n ? 1 : -1)

    let needChange = true
    let feeQuantity = '0'
    let cost = 0n
    let value = 0n
    let change = 0n
    const utxos = []
    for(let i=0; i<sorted.length; i++) {
      utxos.push(sorted[i])
      value += BigInt(sorted[i].value)

      feeQuantity = await service.estimateGas('', [{input: utxos.length, output: 2}])
      cost =  BigInt(amount) + BigInt(feeQuantity) * BigInt(feeRate)

      if(value >= cost) {
        break
      }
    }

    change = value - cost
    if(change <= BITCOIN_DUST_RELAY_SATS) {
      needChange = false
    }

    return {
      selected: utxos,
      change: change,
      needChange,
    }
  }

  public create(words: string, index = 0): IWallet {
    initEccLib(ecc)
    const net = Wallet.getBitcoinNetwork(this.chainType)
    const bip32 = BIP32Factory(ecc)
    const seed = mnemonicToSeedSync(words)
    const root = bip32.fromSeed(seed, net)

    const path = DERIVATION_PATHS[this.chainType] + index
    const child = root.derivePath(path)
    const xOnlyPubkey = child.publicKey.slice(1, 33)
    const p2tr = payments.p2tr({ internalPubkey: xOnlyPubkey, network: net })

    this.nativeWallet = {
      p2tr: p2tr,
      child: child
    }

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

    return this.nativeWallet.p2tr.address ?? ''
  }

  public signTransaction(tx: BitcoinTransaction): Promise<string> {
    if(this.nativeWallet === null) {
      throw new Error('Wallet not created')
    }

    if(!tx.value) {
      throw new Error('Transaction send amount is required')
    }

    const selected = tx.selected
    if(selected === undefined) {
      throw new Error('No UTXOs selected')
    }

    const ECPair = ECPairFactory(ecc)
    const tweakHash = crypto.taggedHash('TapTweak', this.nativeWallet.p2tr.internalPubkey!);
    const tweakedSigner = ECPair.fromPrivateKey(this.nativeWallet.child.privateKey!).tweak(tweakHash)

    const net = Wallet.getBitcoinNetwork(this.chainType)
    const psbt = new Psbt({ network: net })

    // input
    for(const utxo of selected.selected) {
      psbt.addInput({
        hash: utxo.txid,
        index: utxo.vout,
        witnessUtxo: {
          script: this.nativeWallet.p2tr.output!,
          value: BigInt(utxo.value),
        },
        tapInternalKey: this.nativeWallet.p2tr.internalPubkey,
        // sequence: 0xfffffffd, // RBF
      })
    }

    // output
    if(selected.needChange) {
      psbt.addOutput({
        address: tx.from,
        value: selected.change,
      })
    }
    psbt.addOutput({
      address: tx.to,
      value: BigInt(tx.value),
    })

    // sign
    for(let i=0; i<selected.selected.length; i++) {
      psbt.signInput(i, tweakedSigner)
    }
    // for(let i = 0; i < selected.selected.length; i++) {
    //   if (!psbt.validateSignaturesOfInput(i, Wallet.schnorrValidator)) {
    //     throw new Error(`Input ${i} signature verification failed`);
    //   }
    // }

    psbt.finalizeAllInputs()
    const hex = psbt.extractTransaction().toHex()

    return Promise.resolve(hex)
  }

  public signMessage(): Promise<string> {
    throw new Error('Method not implemented.');
  }

  public signTypedData(): Promise<string> {
    throw new Error('Method not implemented.');
  }

  public async prepareBaseCoinTransaction(network: INetwork, tx: BitcoinTransaction): Promise<BitcoinTransaction> {
    const service = ServiceFactory.getService(network.chainType)
    const res = await service.call(network.rpc + `/api/address/${tx.from}/utxo`, 'GET', null)
    const list: BitcoinUtxo[] = JSON.parse(res.result as string)

    return {
      from: tx.from,
      to: tx.to,
      value: '0',
      unspent: list
    }
  }

  public async prepareCoinTransaction(tx: BitcoinTransaction, metaData: {feeUnitPrice: string}): Promise<BitcoinTransaction> {
    if(!tx.value) {
      throw new Error('Transaction send amount is required')
    }

    const selected = await this.selectUtxos(
      metaData.feeUnitPrice,
      tx.value,
      tx.unspent
    )
    tx.selected = selected

    return tx
  }

  prepareBaseTokenTransaction(): Promise<BitcoinTransaction> {
    throw new Error('Method not implemented.')
  }

  prepareTokenTransaction(): Promise<BitcoinTransaction> {
    throw new Error('Method not implemented.')
  }

  encodeTokenTransfer(): string {
    throw new Error('Method not implemented.')
  }
}

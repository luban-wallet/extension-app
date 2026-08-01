import type { ChainType } from '../configs/network'
import type IMnemonic from './IMnemonic'
import type IWallet from './IWallet'
import Mnemonic from './evm/Mnemonic'

const LazyBitcoinWallet = () => import('./bitcoin/Wallet')
const LazyEVMWallet = () => import('./evm/Wallet')

export default class WalletFactory {
  static async getLazyWallet(type: ChainType): Promise<IWallet> {
    if (type === 'EVM') {
      const { default: EVMWallet } = await LazyEVMWallet()
      return new EVMWallet()
    }

    if(type === 'BITCOIN' || type === 'BITCOIN_TESTNET' || type === 'BITCOIN_REGTEST') {
      const { default: BitcoinWallet } = await LazyBitcoinWallet()
      return new BitcoinWallet(type)
    }

    throw new Error('Unsupported chain type')
  }

  // static getWallet(type: ChainType): IWallet {
  //   if (type === 'EVM') {
  //     return new EVMWallet()
  //   }

  //   if(type === 'BITCOIN' || type === 'BITCOIN_TESTNET' || type === 'BITCOIN_REGTEST') {
  //     return new BitcoinWallet(type)
  //   }

  //   throw new Error('Unsupported chain type')
  // }

  static getMnemonic(): IMnemonic {
    return new Mnemonic()
  }
}

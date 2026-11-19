import type { INetwork } from '../configs/network'
import type IMnemonic from './IMnemonic'
import type IWallet from './IWallet'
import Mnemonic from './Mnemonic'

const LazyBitcoinWallet = () => import('./bitcoin/Wallet')
const LazyEVMWallet = () => import('./evm/Wallet')
const LazySVMWallet = () => import('./svm/Wallet')

export default class WalletFactory {
  static async getLazyWallet(network: INetwork): Promise<IWallet> {
    const type = network.chainType

    if (type === 'EVM') {
      const { default: EVMWallet } = await LazyEVMWallet()
      return new EVMWallet(network)
    }

    if(type === 'BITCOIN' || type === 'BITCOIN_TESTNET' || type === 'BITCOIN_REGTEST') {
      const { default: BitcoinWallet } = await LazyBitcoinWallet()
      return new BitcoinWallet(network)
    }

    if(type === 'SVM') {
      const { default: SVMWallet } = await LazySVMWallet()
      return new SVMWallet(network)
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

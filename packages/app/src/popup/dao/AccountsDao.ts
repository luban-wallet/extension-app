import { DERIVATION_PATHS, type IAccount } from '../configs/account'
import { MEM_PWD } from '../configs/constant'
import type { ChainType } from '../configs/network'
import MsgHelper from '../helpers/MsgHelper'
import WalletFactory from '../wallets/WalletFactory'
import Dao from './Dao'

export default class AccountsDao extends Dao<IAccount> {
  constructor() {
    super()
    this.store = 'accounts'
  }

  makeDefaultAccount(address: string, chainType: ChainType): IAccount {
    return {
      index: 0,
      alias: 'Default',
      address: address,
      chainType: chainType,
      derivationPath: DERIVATION_PATHS[chainType] + '0'
    }
  }

  async getOrInsertDefaultAccount(chainType: ChainType): Promise<IAccount | null> {
    let account = await this.getOneByIndex('chainType', chainType)
    if(account !== null) {
      return account
    }

    // Insert a default account
    const pwd = await MsgHelper.memGet<string>(MEM_PWD)
    const wallet = await WalletFactory.getLazyWallet(chainType)
    await wallet.restore(pwd, 0)

    account = this.makeDefaultAccount(wallet.address(), chainType)
    await this.insert(account)

    return account
  }
}

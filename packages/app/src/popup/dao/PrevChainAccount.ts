import type { IAccount } from '../configs/account'
import Dao from './Dao'

export default class PrevChainAccount extends Dao<IAccount> {
  constructor() {
    super()
    this.store = 'prev_chain_account'
  }
}

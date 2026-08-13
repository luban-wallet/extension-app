import type { ITransaction } from '../configs/transaction'
import Dao from './Dao'

export default class TransactionDao extends Dao<ITransaction> {
  constructor() {
    super()
    this.store = 'transactions'
  }
}

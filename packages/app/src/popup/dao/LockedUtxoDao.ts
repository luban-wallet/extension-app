import type { IUTXO } from '../configs/utxo'

import Dao from './Dao'

export default class LockedUtxoDao extends Dao<IUTXO> {
  constructor() {
    super()
    this.store = 'locked_utxos'
  }
}

import type { IUTXO } from '../configs/utxo'

import Dao from './Dao'

export default class LockedUtxosDao extends Dao<IUTXO> {
  constructor() {
    super()
    this.store = 'locked_utxos'
  }
}

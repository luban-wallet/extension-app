import type { INetwork } from '../configs/network'
import Dao from './Dao'

export default class NetworkDao extends Dao<INetwork> {
  constructor() {
    super()
    this.store = 'networks'
  }
}

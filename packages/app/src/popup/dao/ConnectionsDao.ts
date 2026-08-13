import type { IConnection } from '../configs/connections'
import Dao from './Dao'

export default class ConnectionsDao extends Dao<IConnection> {
  constructor() {
    super()
    this.store = 'connections'
  }

  async isConnected(url: string): Promise<boolean> {
    const list = await this.getAll()
    if(list === null) {
      return false
    }

    const find = list.some(item => item.url === url)
    return find
  }
}

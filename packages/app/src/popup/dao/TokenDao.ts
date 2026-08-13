import type { IToken } from '../configs/token'
import Dao from './Dao'

export default class TokenDao extends Dao<IToken> {
  constructor() {
    super()
    this.store = 'tokens'
  }
}

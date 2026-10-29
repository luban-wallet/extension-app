import type { IContact } from '../configs/contact'
import Dao from './Dao'

export default class ContactDao extends Dao<IContact> {
  constructor() {
    super()
    this.store = 'contacts'
  }
}

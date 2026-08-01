import DB from '@lubankit/indexeddb'
import { WALLET_DB, WALLET_DB_VER } from '../configs/constant'

export default class Dao<T> {
  static dbInstance: DB | null = null
  store = ''

  protected initDB(): void {
    if(Dao.dbInstance === null) {
      Dao.dbInstance = new DB({dbName: WALLET_DB, version: WALLET_DB_VER})
    }
  }

  protected close(): void {
    if(Dao.dbInstance !== null) {
      Dao.dbInstance.close()
    }
  }

  public async insert(data: T): Promise<boolean> {
    this.initDB()

    let rs = false
    try {
      const com = await Dao.dbInstance!.getCommand()
      rs = await com.add(this.store, data)
    } catch(e) {
      console.error(e)
    }

    this.close()

    return rs
  }

  public async delete(pk: number): Promise<boolean> {
    this.initDB()

    let rs = false
    try {
      const com = await Dao.dbInstance!.getCommand()
      rs = await com.delete(this.store, pk)
    } catch(e) {
      console.error(e)
    }

    this.close()

    return rs
  }

  public async update(data: T): Promise<boolean> {
    this.initDB()

    let rs = false
    try {
      const com = await Dao.dbInstance!.getCommand()
      rs = await com.update(this.store, data)
    } catch(e) {
      console.error(e)
    }

    this.close()

    return rs
  }

  public async getOne(pk: number): Promise<T | null> {
    this.initDB()

    let rs: T | null = null
    try {
      const com = await Dao.dbInstance!.getCommand()
      rs = await com.queryOne(this.store, pk)
    } catch(e) {
      console.error(e)
    }

    this.close()

    return rs
  }

  public async getAll(): Promise<T[] | null> {
    this.initDB()

    let rs = null
    try {
      const com = await Dao.dbInstance!.getCommand()
      rs = await com.queryAll(this.store)
    } catch(e) {
      console.error(e)
    }

    this.close()

    return rs
  }

  public async getAllByIndex(indexName: string, indexValue: IDBValidKey): Promise<T[] | null> {
    this.initDB()

    let rs = null
    try {
      const com = await Dao.dbInstance!.getCommand()
      rs = await com.queryAllByIndex(this.store, indexName, indexValue)
    } catch(e) {
      console.error(e)
    }

    this.close()

    return rs
  }

  public async getOneByIndex(indexName: string, indexValue: IDBValidKey): Promise<T | null> {
    this.initDB()

    let rs = null
    try {
      const com = await Dao.dbInstance!.getCommand()
      rs = await com.queryOneByIndex(this.store, indexName, indexValue)
    } catch(e) {
      console.error(e)
    }

    this.close()

    return rs
  }
}

import DB from '@lubankit/indexeddb'
import { WALLET_DB, WALLET_DB_VER } from '../configs/constant'

export default class Dao<T> {
  static dbInstance: DB | null = null
  public store = ''

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
      const com = await Dao.dbInstance!.getCommand<T>()
      rs = await com.add(this.store, data)
    } catch(e) {
      console.log(e)
    }

    this.close()

    return rs
  }

  public async delete(pk: number): Promise<boolean> {
    this.initDB()

    let rs = false
    try {
      const com = await Dao.dbInstance!.getCommand<T>()
      rs = await com.delete(this.store, pk)
    } catch(e) {
      console.log(e)
    }

    this.close()

    return rs
  }

  public async clear(): Promise<boolean> {
    this.initDB()

    let rs = false
    try {
      const com = await Dao.dbInstance!.getCommand<T>()
      rs = await com.clear(this.store)
    } catch(e) {
      console.log(e)
    }

    this.close()

    return rs
  }

  public async update(data: T): Promise<boolean> {
    this.initDB()

    let rs = false
    try {
      const com = await Dao.dbInstance!.getCommand<T>()
      rs = await com.update(this.store, data)
    } catch(e) {
      console.log(e)
    }

    this.close()

    return rs
  }

  public async getOne(pk: number): Promise<T | null> {
    this.initDB()

    let rs: T | null = null
    try {
      const com = await Dao.dbInstance!.getCommand<T>()
      rs = await com.queryOne(this.store, pk)
    } catch(e) {
      console.log(e)
    }

    this.close()

    return rs
  }

  public async getAll(): Promise<T[]> {
    this.initDB()

    let rs: T[] = []
    try {
      const com = await Dao.dbInstance!.getCommand<T>()
      rs = await com.queryAll(this.store)
    } catch(e) {
      console.log(e)
    }

    this.close()

    return rs
  }

  public async getAllByIndex(indexName: string, indexValue: IDBValidKey): Promise<T[]> {
    this.initDB()

    let rs: T[] = []
    try {
      const com = await Dao.dbInstance!.getCommand<T>()
      rs = await com.queryAllByIndex(this.store, indexName, indexValue)
    } catch(e) {
      console.log(e)
    }

    this.close()

    return rs
  }

  public async getOneByIndex(indexName: string, indexValue: IDBValidKey): Promise<T | null> {
    this.initDB()

    let rs: T | null = null
    try {
      const com = await Dao.dbInstance!.getCommand<T>()
      rs = await com.queryOneByIndex(this.store, indexName, indexValue)
    } catch(e) {
      console.log(e)
    }

    this.close()

    return rs
  }

  public async getListByPage(page: number, pageSize: number): Promise<{total: number, data: T[]}> {
    this.initDB()

    let total = 0
    let rs: T[] = []
    try {
      const com = await Dao.dbInstance!.getCommand<T>()
      total = await com.count(this.store)
      rs = await com.queryListByPage(this.store, page, pageSize)
    } catch(e) {
      console.log(e)
    }

    this.close()

    return {
      total,
      data: rs
    }
  }

  public async getListByPageAndIndex(page: number, pageSize: number, indexName: string, indexValue: IDBValidKey): Promise<{total: number, data: T[]}> {
    this.initDB()

    let total = 0
    let rs: T[] = []
    try {
      const com = await Dao.dbInstance!.getCommand<T>()
      total = await com.countByIndex(this.store, indexName, indexValue)
      rs = await com.queryListByPageAndIndex(this.store, page, pageSize, indexName, indexValue)
    } catch(e) {
      console.log(e)
    }

    this.close()

    return {
      total,
      data: rs
    }
  }
}

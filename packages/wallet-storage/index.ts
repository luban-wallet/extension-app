interface IStorage<T = any> {
  set(key: string, value: T): Promise<void>
  batchSet(values: Record<string, T>): Promise<void>
  get(key: string): Promise<T | null>
  /**
   * Delete the key and return the removed value
   */
  remove(key: string): Promise<T | null>
  batchRemove(keys: string[]): Promise<void>
}

const ENV = import.meta.env.DEV ? 'development' : 'production'
console.log('Storage ENV: ', ENV)

export class Storage {
  static instances: Record<string, IStorage> = {}

  static getInstance<T>(type: 'mem' | 'local'): IStorage<T> {
    if(Storage.instances[type] === undefined) {
      if(type === 'mem') {
        Storage.instances[type] = new MemCache<T>()
      } else {
        Storage.instances[type] = new LocalCache<T>()
      }
    }
    return Storage.instances[type]
  }
}

class LocalCache<T> implements IStorage<T> {
  static browser = (globalThis as any).chrome

  async set(key: string, value: T): Promise<void> {
    if(ENV === 'development') {
      return Promise.resolve(
        localStorage.setItem(key, JSON.stringify(value))
      )
    }

    const data = {
      [key]: value
    }
    return LocalCache.browser.storage.local.set(data)
  }

  async batchSet(values: Record<string, T>): Promise<void> {
    if(ENV === 'development') {
      for(let k in values) {
        localStorage.setItem(k, JSON.stringify(values[k]))
      }
      return Promise.resolve(void 0)
    }

    return LocalCache.browser.storage.local.set(values)
  }

  async get(key: string): Promise<T | null> {
    if(ENV === 'development') {
      const val = localStorage.getItem(key)
      if(val === null) {
        return Promise.resolve(null)
      }
      return Promise.resolve(JSON.parse(val))
    }

    const obj: any = await LocalCache.browser.storage.local.get(key)
    return obj[key] === undefined ? null : obj[key]
  }

  async remove(key: string): Promise<T | null> {
    if(ENV === 'development') {
      const value = localStorage.getItem(key)
      localStorage.removeItem(key)
      if(value === null) {
        return Promise.resolve(null)
      }
      return Promise.resolve(JSON.parse(value))
    }

    const obj: any = await LocalCache.browser.storage.local.get(key)
    await LocalCache.browser.storage.local.remove(key)

    return obj[key] === undefined ? null : obj[key]
  }

  batchRemove(keys: string[]): Promise<void> {
    if(ENV === 'development') {
      for(let k of keys) {
        localStorage.removeItem(k)
      }
      return Promise.resolve(void 0)
    }

    return LocalCache.browser.storage.local.remove(keys)
  }
}

class MemCache<T> implements IStorage<T> {
  private static state: any = {}

  set(key: string, value: T): Promise<void> {
    MemCache.state[key] = value
    return Promise.resolve()
  }

  batchSet(values: Record<string, T>): Promise<void> {
    for(let k in values) {
      MemCache.state[k] = values[k]
    }
    return Promise.resolve()
  }

  get(key: string): Promise<T | null> {
    const v = MemCache.state[key] === undefined ? null : MemCache.state[key]
    return Promise.resolve(v)
  }

  remove(key: string): Promise<T | null> {
    const v = MemCache.state[key] === undefined ? null : MemCache.state[key]
    delete MemCache.state[key]
    return Promise.resolve(v)
  }

  batchRemove(keys: string[]): Promise<void> {
    for(let k of keys) {
      delete MemCache.state[k]
    }
    return Promise.resolve()
  }
}

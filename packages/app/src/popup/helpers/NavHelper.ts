import type { NavigateFunction } from "react-router"

const DEV = import.meta.env.DEV

export default class FullPageHelper {
  static nav(routerNav: NavigateFunction, path: string) {
    if(DEV) {
      routerNav(path)
      return
    }

    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const global = globalThis as any
    const url = global.chrome.runtime.getURL('index.html')
    global.open(url + '#' + path, '_blank')
  }
}
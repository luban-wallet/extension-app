import MessageChannelExtensionDom from '@lubankit/msg-channel/extension-dom'
import { DEBUG_TEST_PASSWORD, MEM_LIFETIME_MS, MEM_PWD } from '../configs/constant'
import type { ProviderResponse } from '../configs/provider'

const DEV = import.meta.env.DEV

export default class MsgHelper {
  static async notify(payload: { action: string, data: unknown }): Promise<void> {
    if(DEV) {
      return
    }

    const message = {
      type: '@p2d',
      data: payload,
    }

    await MessageChannelExtensionDom.sendMessageToContent<void>(message)
  }

  static async memSet<T>(key: string, value: T): Promise<void> {
    if(DEV) {
      return
    }

    await MessageChannelExtensionDom.sendMessageToService<void>({
      type: 'memSet',
      data: { key, value }
    })
  }

  static async memGet<T>(key: string): Promise<T> {
    if(DEV) {
      return DEBUG_TEST_PASSWORD as unknown as T
    }

    const value = await MessageChannelExtensionDom.sendMessageToService<T>({
      type: 'memGet',
      data: key
    })

    return value
  }

  static async providerRequestGrabData<T>(): Promise<T> {
    const value = await MessageChannelExtensionDom.sendMessageToService<T>({
      type: '@providerRequestGrabData',
      data: null
    })

    return value
  }

  static async providerResponse(data: ProviderResponse<unknown>): Promise<boolean> {
    const value = await MessageChannelExtensionDom.sendMessageToService<boolean>({
      type: '@providerResponse',
      data
    })

    return value
  }

  static async lock(): Promise<void> {
    await MsgHelper.memSet(MEM_PWD, '')
    await MsgHelper.memSet(MEM_LIFETIME_MS, 1024);
  }
}

import LimitedFetch from '@lubankit/utils/LimitedFetch'
import type IService from '../IService'

/**
 * Provides methods to interact with a REST API.
 */
export default class RestApiService implements IService {
  async call(rpc: string, method: string, params: unknown): Promise<{ result: string; }> {
    const res = await LimitedFetch.request(rpc, {
      method: method,
      body: params as string
    })
    const text = await res.text()

    if(text.includes('error')) {
      throw new Error(text)
    }

    return {
      result: text
    }
  }

  getTransactionCount(): Promise<string> {
    return Promise.resolve('0x0')
  }

  async sendRawTransaction(rpc: string, tx: string[]): Promise<string> {
    const res = await this.call(rpc + '/api/tx', 'POST', tx[0])
    return res.result
  }

  gasPrice(): Promise<string> {
    return Promise.resolve('0x0')
  }

  /**
   * Estimate the size of a Bitcoin transaction
   */
  estimateGas(_rpc: string, params: {input: number, output: number}[]): Promise<string> {
    // 10.5 (base header) + 40.75 (witness header) + inputs * 57.25 + outputs * 43 + 11 (fixed tail)
    const size = 10.5 + 40.75 + 57.25 * params[0].input + 43 * params[0].output + 11

    return Promise.resolve(BigInt(Math.ceil(size)).toString())
  }

  async getRecommendTransactionFees(rpc: string): Promise<{ baseFee: string; priorityFees: string[]; }> {
    const res = await this.call(rpc + '/api/v1/fees/recommended', 'GET', null)
    const json = JSON.parse(res.result)

    return {
      baseFee: '0x0',
      priorityFees: [
        json.hourFee,
        json.halfHourFee,
        json.fastestFee
      ]
    }
  }

  getTokenMetadata(): Promise<{ name: string; symbol: string; decimals: string; totalSupply: string; }> {
    throw new Error('Method not implemented.')
  }

  getTokenBalance(): Promise<string> {
    throw new Error('Method not implemented.')
  }

  async getCoinBalance(rpc: string, address: string): Promise<{available: string, unconfirmed: string}> {
    const res = await this.call(rpc + '/api/address/' + address, 'GET', null)
    const json = JSON.parse(res.result)

    const chainFunded = BigInt(json.chain_stats.funded_txo_sum)
    const chainSpent = BigInt(json.chain_stats.spent_txo_sum)
    const mempoolFunded = BigInt(json.mempool_stats.funded_txo_sum)
    const mempoolSpent = BigInt(json.mempool_stats.spent_txo_sum)
    let available = chainFunded - chainSpent
    const unconfirmed = mempoolFunded - mempoolSpent

    // Give priority to deducting the spent amount
    if(unconfirmed < 0n) {
      available += unconfirmed
    }

    return {
      available: available.toString(),
      unconfirmed: unconfirmed.toString()
    }
  }
}

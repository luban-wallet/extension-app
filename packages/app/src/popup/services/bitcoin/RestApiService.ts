import LimitedFetch from '@lubankit/utils/LimitedFetch'
import type IService from '../IService'
import type { IUTXO } from '../../configs/utxo'
// import LockedUtxoDao from '../../dao/LockedUtxoDao'

/**
 * Provides methods to interact with a REST API.
 */
export default class RestApiService implements IService {
  public async call(rpc: string, method: string, params: unknown): Promise<{ result: string }> {
    const res = await LimitedFetch.request(rpc, {
      method: method,
      body: params as string
    })
    const text = await res.text()

    return {
      result: text.trim()
    }
  }

  public async getTransactionCount(): Promise<string> {
    return '0x0'
  }

  public async sendRawTransaction(rpc: string, tx: string[]): Promise<string> {
    const res = await this.call(rpc + '/api/tx', 'POST', tx[0])
    return res.result
  }

  public async gasPrice(): Promise<string> {
    return '0x0'
  }

  /**
   * Estimate the size of a Bitcoin p2tr transaction
   *
   * Only estimates the size for keypath-based inputs.
   *
   * `Fee = vSize * feeRate`
   */
  public async estimateGas(_rpc: string, params: {input: number, output: number}[]): Promise<string> {
    // 10.5 (overhead) + (inputs * 57.5) + (outputs * 43)
    const size = 10.5
      + 57.5 * params[0].input
      + 43 * params[0].output

    return BigInt(Math.ceil(size)).toString()
  }

  public async getRecommendTransactionFees(rpc: string): Promise<{ baseFee: string, priorityFees: string[] }> {
    const res = await this.call(rpc + '/api/v1/fees/recommended', 'GET', null)
    const json = JSON.parse(res.result)

    return {
      baseFee: '0x0',
      priorityFees: [
        BigInt(Math.ceil(json.hourFee)).toString(),
        BigInt(Math.ceil(json.halfHourFee)).toString(),
        BigInt(Math.ceil(json.fastestFee)).toString()
      ]
    }
  }

  public async getTokenMetadata(): Promise<{ name: string, symbol: string, decimals: string, totalSupply: string }> {
    throw new Error('getTokenMetadata(), Method not implemented.')
  }

  public async getTokenBalance(): Promise<string> {
    throw new Error('getTokenBalance(), Method not implemented.')
  }

  public async getCoinBalance(rpc: string, address: string): Promise<{available: string, unconfirmed: string, locked: string}> {
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
      unconfirmed: unconfirmed.toString(),
      locked: '0'
    }
  }

  public async getUnspentList(rpc: string, address: string): Promise<IUTXO[]> {
    const res = await this.call(rpc + '/api/address/' + address + '/utxo', 'GET', null)
    const all = JSON.parse(res.result) as IUTXO[]
    return all

    // // locked data
    // const map: Record<string, number> = {}
    // const locked = await new LockedUtxoDao().getAllByIndex('address', address)
    // for(const lock of locked) {
    //   map[lock.txid + ':' + lock.vout] = 1
    // }

    // // filter out the locked utxos
    // const availables = all.filter((utxo) => {
    //   return map[utxo.txid + ':' + utxo.vout] === undefined
    // })

    // return availables
  }

  public async getTransactionStatus(rpc: string, txHash: string): Promise<{status: 'pending' | 'success' | 'failed'} | null> {
    const res = await this.call(rpc + '/api/tx/' + txHash, 'GET', null)
    if(!res.result.startsWith('{')) {
      return null
    }

    const json = JSON.parse(res.result)
    if(json.status) {
      return { status: json.status.confirmed ? 'success' : 'pending' }
    }
    return { status: 'pending' }
  }
}

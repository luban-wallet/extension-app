import LimitedFetch from "@lubankit/utils/LimitedFetch"
import type { IUTXO } from "../../configs/utxo"
import type IService from "../IService"
import { SOLANA_BASE_FEE } from "../../configs/constant"

export default class Service implements IService {
  async call<R>(rpc: string, method: string, params: unknown): Promise<{ result: R }> {
    const config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: 1,
        jsonrpc: '2.0',
        method,
        params
      })
    }
    const res = await LimitedFetch.request(rpc, config)
    const json = await res.json()

    if(typeof json.error !== 'undefined') {
      throw new Error(json.error.message)
    }
    return json
  }

  async getCoinBalance(rpc: string, address: string): Promise<{ available: string, unconfirmed: string, locked: string }> {
    const json = await this.call<{ value: number }>(rpc, 'getBalance', [
      address, {"commitment": "finalized"}
    ])

    const value = BigInt(json.result.value).toString()
    return {
      available: value,
      unconfirmed: '0x0',
      locked: '0x0'
    }
  }

  getTransactionCount(): Promise<string> {
    return Promise.resolve('0x0')
  }

  async sendRawTransaction(rpc: string, tx: string[]): Promise<string> {
    const json = await this.call<string>(rpc, 'sendTransaction', [
      tx[0],
      { "encoding": "base64", "skipPreflight": false }
    ])
    return json.result
  }

  estimateGas(): Promise<string> {
    throw new Error("Method not implemented.")
  }

  async getRecommendTransactionFees(rpc: string): Promise<{ baseFee: string, priorityFees: string[] }> {
    const res = await this.call<{prioritizationFee: number}[]>(rpc, 'getRecentPrioritizationFees', undefined)
    const fees: number[] = []
    for(let i=0; i<res.result.length; i++) {
      fees.push(res.result[i].prioritizationFee)
      if(fees.length >= 3) {
        break
      }
    }

    // Sort ASC
    fees.sort((a, b) => BigInt(a) - BigInt(b) >= 0n ? 1 : -1)
    const fee1 = fees[0] === undefined ? '0' : BigInt(fees[0]).toString()
    const fee2 = fees[1] === undefined ? '0' : BigInt(fees[1]).toString()
    const fee3 = fees[2] === undefined ? '0' : BigInt(fees[2]).toString()

    return {
      baseFee: SOLANA_BASE_FEE.toString(),
      priorityFees: [
        fee1,
        fee2,
        fee3
      ]
    }
  }

  getTokenMetadata(): Promise<{ name: string; symbol: string; decimals: string; totalSupply: string; }> {
    throw new Error("Method not implemented.")
  }

  getTokenBalance(): Promise<string> {
    throw new Error("Method not implemented.")
  }

  getUnspentList(): Promise<IUTXO[]> {
    throw new Error("Method not implemented.")
  }

  async getTransactionStatus(rpc: string, txHash: string): Promise<{ status: "pending" | "success" | "failed" } | null> {
    const json = await this.call<{blockTime: number} | null>(rpc, 'getTransaction', [
      txHash,
      {
        maxSupportedTransactionVersion: 1
      }
    ])
    const data = json.result

    if(!data) {
      return null
    }
    return { status: 'success' }
  }
}

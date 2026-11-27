import LimitedFetch from "@lubankit/utils/LimitedFetch"
import type { IUTXO } from "../../configs/utxo"
import type IService from "../IService"
import { SOLANA_ASSOCIATED_TOKEN_PROGRAM_ID, SOLANA_BASE_FEE, SOLANA_SPL_TOKEN_PROGRAM_ID, SOLANA_TOKEN_2022_PROGRAM_ID } from "../../configs/constant"
import {
  type AccountInfoBase,
  type AccountInfoWithBase64EncodedData,
  type Address,
  getAddressEncoder,
  getProgramDerivedAddress
} from "@solana/kit"

export default class Service implements IService {
  public async call<R>(rpc: string, method: string, params: unknown): Promise<{ result: R }> {
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

  public async getCoinBalance(rpc: string, address: string): Promise<{ available: string, unconfirmed: string, locked: string }> {
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

  public async getTransactionCount(): Promise<string> {
    return '0x0'
  }

  public async sendRawTransaction(rpc: string, tx: string[]): Promise<string> {
    const json = await this.call<string>(rpc, 'sendTransaction', [
      tx[0],
      { "encoding": "base64", "skipPreflight": false }
    ])
    return json.result
  }

  public async estimateGas(): Promise<string> {
    throw new Error("Method not implemented.")
  }

  public async getRecommendTransactionFees(rpc: string): Promise<{ baseFee: string, priorityFees: string[] }> {
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

  public async getTokenMetadata(rpc: string, contract: string): Promise<{ name: string; symbol: string; decimals: string; totalSupply: string; }> {
    // const encoder = getAddressEncoder()
    // const program = encoder.encode(SOLANA_METADATA_PROGRAM_ID as Address)
    // const address = encoder.encode(contract as Address)

    // const pda = await getProgramDerivedAddress({
    //   programAddress: SOLANA_METADATA_PROGRAM_ID as Address,
    //   seeds: [
    //     new TextEncoder().encode("metadata"),
    //     program,
    //     address
    //   ]
    // })

    const res = await this.call<{value: AccountInfoBase & AccountInfoWithBase64EncodedData}>(rpc, 'getAccountInfo', [
      contract,
      {
        "commitment": "finalized",
        "encoding": "base64"
      }
    ])

    const value = res.result.value
    if(!value) {
      throw new Error("Account not found")
    }

    const owner = value.owner
    let parsed: { supply: bigint; decimals: bigint } | null = null

    // Parse SPL Token
    if(owner === SOLANA_SPL_TOKEN_PROGRAM_ID || owner === SOLANA_TOKEN_2022_PROGRAM_ID) {
      parsed = parseTokenMint(value.data[0])
    }

    if(parsed === null) {
      throw new Error("Failed to parse token info")
    }

    return {
      name: '',
      symbol: '',
      decimals: parsed.decimals.toString(),
      totalSupply: parsed.supply.toString()
    }
  }

  public async getTokenBalance(rpc: string, contract: string, address: string): Promise<string> {
    const info = await this.call<{value: AccountInfoBase & AccountInfoWithBase64EncodedData}>(rpc, 'getAccountInfo', [
      contract,
      {
        "commitment": "finalized",
        "encoding": "base64"
      }
    ])
    const value = info.result.value
    if(!value) {
      throw new Error("Mint account not found")
    }

    const pda = await getProgramDerivedAddress({
      programAddress: SOLANA_ASSOCIATED_TOKEN_PROGRAM_ID as Address,
      seeds: [
        getAddressEncoder().encode(address as Address),
        getAddressEncoder().encode(value.owner as Address),
        getAddressEncoder().encode(contract as Address),
      ]
    })

    let amount = '0'
    try {
      const res = await this.call<{value: {amount: string}}>(rpc, 'getTokenAccountBalance', [
        pda[0],
        {
          "commitment": "finalized",
        }
      ])
      amount = res.result.value.amount
    } catch(e) {
      console.log(e)
    }

    return amount
  }

  public async getUnspentList(): Promise<IUTXO[]> {
    throw new Error("Method not implemented.")
  }

  public async getTransactionStatus(rpc: string, txHash: string): Promise<{ status: "pending" | "success" | "failed" } | null> {
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

function parseTokenMint(bytes: string) {
  const buf = Buffer.from(bytes, 'base64')

  const supply = buf.readBigUInt64LE(36)
  // decimals: offset 44, u8
  const decimals = BigInt(buf.readUInt8(44))

  return {
    supply,
    decimals,
  }
}
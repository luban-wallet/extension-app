import LimitedFetch from '@lubankit/utils/LimitedFetch'
import type IService from '../IService'

export default class Service implements IService {
  decodeHexString(hexString: string) {
    // 1. Remove the '0x' prefix and convert to lowercase
    const hex = hexString.startsWith('0x') ? hexString.substring(2) : hexString;
    if (hex.length < 192) {
      throw new Error('Invalid hex string: too short to be ABI-encoded string');
    }

    // 3. ABI encoding rules:
    // - The first 32 bytes (64 hex): represent the offset of the data, usually 0x20 (indicating that the data starts from the 32nd byte)
    // - The next 32 bytes: indicate the length of the string
    // - And then the actual data comes after
    const offsetHex = hex.substring(0, 64);
    const offset = parseInt(offsetHex, 16);
    if (offset < 32) {
      throw new Error('Invalid offset in ABI encoding');
    }

    // 4. Calculate the length of the string
    const lengthHex = hex.substring(64, 128);
    const strLength = parseInt(lengthHex, 16);
    if (strLength <= 0) {
      throw new Error('Invalid string length in ABI encoding');
    }

    // console.log(offset * 2 * 2, strLength * 2)
    // 5. Calculate the starting position of the actual string data
    const raw = hex.substring(offset * 2 * 2, offset * 2 * 2 + strLength * 2);

    // 6. Convert hex to UTF-8 string
    let result = '';
    for (let i = 0; i < raw.length; i += 2) {
      const byte = raw.substring(i, i+2);
      result += String.fromCharCode(parseInt(byte, 16));
    }

    return result;
  }

  async call<R>(rpc: string, method: string, params: unknown): Promise<{ result: R; }> {
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
      throw new Error(`RPC Error ${json.error.code}: ${json.error.message}`)
    }

    return json
  }

  async getTransactionCount(rpc: string, address: string): Promise<string> {
    const json = await this.call<string>(rpc, 'eth_getTransactionCount', [ address, 'latest' ])
    return json.result
  }

  async sendRawTransaction(rpc: string, tx: string[]): Promise<string> {
    const json = await this.call<string>(rpc, 'eth_sendRawTransaction', tx)
    return json.result
  }

  async gasPrice(rpc: string): Promise<string> {
    const json = await this.call<string>(rpc, 'eth_gasPrice', [])
    return json.result
  }

  async estimateGas(rpc: string, params: unknown[]): Promise<string> {
    const json = await this.call<string>(rpc, 'eth_estimateGas', params)
    return json.result
  }

  async getRecommendTransactionFees(rpc: string): Promise<{ baseFee: string; priorityFees: string[]; }> {
    const historyData = await this.call<{baseFeePerGas: string[], reward: string[][]}>(rpc, 'eth_feeHistory', [
      '0x1',
      'latest',
      [20, 50, 80]
    ])

    const history = historyData.result
    const fees = history.reward.length > 0 ? history.reward[0] : ['0x0', '0x0', '0x0']
    let nextBaseFee = history.baseFeePerGas.length > 0
      ? history.baseFeePerGas[history.baseFeePerGas.length - 1]
      : '0x0'

    // Use legacy gas price as baseFee if EIP-1559 is not supported
    if(nextBaseFee === '0x0') {
      nextBaseFee = await this.gasPrice(rpc)
    }

    return {
      baseFee: nextBaseFee,
      priorityFees: fees
    }
  }

  async getTokenMetadata(rpc: string, contract: string): Promise<{ name: string; symbol: string; decimals: string; totalSupply: string; }> {
    const nameSig = '0x06fdde03'
    const symbolSig = '0x95d89b41'
    const decimalsSig = '0x313ce567'
    const totalSupplySig = '0x18160ddd'

    const symbolCall = await this.call<string>(rpc, 'eth_call', [ { to: contract, data: symbolSig }, 'latest' ])
    const symbol = this.decodeHexString(symbolCall.result)

    const nameCall = await this.call<string>(rpc, 'eth_call', [ { to: contract, data: nameSig }, 'latest' ])
    const name = this.decodeHexString(nameCall.result)

    const decimalsCall = await this.call<string>(rpc, 'eth_call', [ { to: contract, data: decimalsSig }, 'latest' ])
    const decimals = BigInt(decimalsCall.result ?? '0x0').toString(10)

    const totalSupplyCall = await this.call<string>(rpc, 'eth_call', [ { to: contract, data: totalSupplySig }, 'latest' ])
    const totalSupply = BigInt(totalSupplyCall.result ?? '0x0').toString(10)

    return {
      name,
      symbol,
      decimals,
      totalSupply
    }
  }

  async getTokenBalance(rpc: string, contract: string, address: string): Promise<string> {
    const balanceSig = '0x70a08231'
    const makeErc20InputParam = (value: string) => {
      if(value.indexOf('0x') === 0) {
        value = value.substring(2)
      }
      while(value.length < 64) {
        value = '0' + value
      }
      return value
    }
    const params = [
      {
        from: address,
        to: contract,
        data: balanceSig + makeErc20InputParam(address)
      },
      'latest'
    ]
    const json = await this.call<string>(rpc, 'eth_call', params)

    return json.result
  }

  async getCoinBalance(rpc: string, address: string): Promise<{available: string, unconfirmed: string}> {
    const json = await this.call<string>(rpc, 'eth_getBalance', [ address, 'latest' ])
    return {
      available: json.result,
      unconfirmed: '0x0'
    }
  }
}

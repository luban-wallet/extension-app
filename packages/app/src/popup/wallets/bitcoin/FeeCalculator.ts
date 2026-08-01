import { toMaximalUnit } from '../../utils/util'
// import type IFeeCalculator from '../IFeeCalculator'
import { type INetwork } from '../../configs/network'

export default class FeeCalculator {
  calculate(data: {
    baseFee: string
    unitPrice: string
    quantity: string
    network: INetwork | null
  }): { result: string; formula: string; } {
    const { baseFee, unitPrice, quantity, network } = data
    const result = { result: '', formula: '' }

    if (baseFee === '' || unitPrice === '' || quantity === '' || network === null) {
      return result
    }

    try {
      const fee = BigInt(unitPrice) * BigInt(quantity)
      result.result = toMaximalUnit(fee.toString(), network.chainType) + ' ' + network.symbol
      result.formula = `unitPrice * ${BigInt(quantity).toString()}`

      return result
    } catch (e) {
      console.error(e)
    }

    return result
  }

}

import { useContext } from "react"
import type { IProps } from "./type"
import { WalletContext } from "../../contexts/WalletContext"
import { toMaximalUnit } from "../../utils/util"

export default function Evm(props: IProps) {
  const { currentNetwork } = useContext(WalletContext)!
  const { baseFee, priorityFee, gasLimit } = props

  if (currentNetwork === null) {
    return null
  }

  const fee = (BigInt(baseFee) + BigInt(priorityFee)) * BigInt(gasLimit)
  const result = toMaximalUnit(fee.toString(), currentNetwork.chainType) + ' ' + currentNetwork.symbol
  const formula = `(baseFee + unitPrice) * ${BigInt(gasLimit).toString()}`

  return (
    <div>
      <p>≈ {result}</p>
      <p>{formula}</p>
    </div>
  )
}

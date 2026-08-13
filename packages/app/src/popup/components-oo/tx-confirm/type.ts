export interface IProps {
  isToken: boolean
  from: string
  to: string
  amount: string
  symbol: string
  baseFee: string
  feeUnitPrice: string
  onConfirm: (transactionFee: string, feeQuantity: string) => void
}

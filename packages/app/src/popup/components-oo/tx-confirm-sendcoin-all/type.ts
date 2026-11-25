export interface IProps {
  from: string
  to: string
  /**
   * Send amount include decimals
   */
  amount: string
  symbol: string
  baseFee: string
  feeUnitPrice: string
  onConfirm: (data: {gasLimit: string, transactionFee: bigint, canSendAmount: bigint}) => void
}

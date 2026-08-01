export interface IProps {
  /**
   * All are decimal strings, unit is wei
   */
  onFeeChange: (fee: {baseFee: string, priorityFee: string}) => void
}

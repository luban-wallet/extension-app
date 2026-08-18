export interface IUTXO {
  /** Key */
  id?: number
  /** Index */
  address?: string

  txid: string
  vout: number
  value: number
}

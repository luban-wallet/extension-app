import type { ChainType } from "./network"

export interface IAccount {
  id?: number
  alias: string
  address: string
  index: number
  chainType: ChainType
  derivationPath: string
}

export const DERIVATION_PATHS: Record<ChainType, string> = {
  'EVM': "m/44'/60'/0'/0/",
  'BITCOIN': "m/86'/0'/0'/0/",
  'BITCOIN_TESTNET': "m/86'/1'/0'/0/",
  'BITCOIN_REGTEST': "m/86'/1'/0'/0/",
}

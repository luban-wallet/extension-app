import type { ChainType } from "./network"

export interface IAccount {
  id?: number
  alias: string
  address: string
  index: number
  chainType: ChainType
  derivationPath: string
}

/**
 * BIP-44 Path: `m / purpose' / coin_type' / account' / change / address_index`
 */
export const DERIVATION_PATHS: Record<ChainType, string> = {
  // Non-hardened
  'EVM': "m/44'/60'/0'/0/{i}",
  'BITCOIN': "m/86'/0'/0'/0/{i}",
  'BITCOIN_TESTNET': "m/86'/1'/0'/0/{i}",
  'BITCOIN_REGTEST': "m/86'/1'/0'/0/{i}",
  // Solana Hardened
  'SVM': "m/44'/501'/{i}'/0'"
}

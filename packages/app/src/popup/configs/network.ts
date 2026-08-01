export type ChainType = 'EVM' | 'BITCOIN' | 'BITCOIN_TESTNET' | 'BITCOIN_REGTEST'

export interface INetwork {
  id?: number
  icon?: string
  name: string
  /**
   * Decimal chainId
   */
  chainId: string
  symbol: string
  rpc: string
  explorer: string
  testnet: string
  chainType: ChainType
}

export const networkUnits: Record<ChainType, {valueDecimal: number, valueSymbol: string}> = {
  'EVM': {
    valueDecimal: 18,
    valueSymbol: 'wei',
  },
  'BITCOIN': {
    valueDecimal: 8,
    valueSymbol: 'sat',
  },
  'BITCOIN_TESTNET': {
    valueDecimal: 8,
    valueSymbol: 'sat',
  },
  'BITCOIN_REGTEST': {
    valueDecimal: 8,
    valueSymbol: 'sat',
  }
}

export const defaultNetworks: INetwork[] = [
  {
    name: 'Ethereum Mainnet',
    icon: '/images/token-eth.png',
    chainId: '1',
    symbol: 'ETH',
    rpc: 'https://eth-mainnet.g.alchemy.com/v2/kcdnmn-4x5-9pzi3ZMymRPDr6SIf1LgH',
    explorer: 'https://etherscan.io',
    testnet: '0',
    chainType: 'EVM'
  },
  {
    name: 'BSC Mainnet',
    icon: '/images/token-bsc.png',
    chainId: '56',
    symbol: 'BNB',
    rpc: 'https://bsc-dataseed.bnbchain.org',
    explorer: 'https://bscscan.com',
    testnet: '0',
    chainType: 'EVM'
  },
  {
    name: 'Bitcoin Mainnet',
    icon: '/images/token-bitcoin.png',
    chainId: '-1',
    symbol: 'BTC',
    rpc: 'https://mempool.space',
    explorer: 'https://mempool.space',
    testnet: '0',
    chainType: 'BITCOIN'
  },
  {
    name: 'Ethereum Classic',
    icon: '/images/token-etc.png',
    chainId: '61',
    symbol: 'ETC',
    rpc: 'https://etc.rivet.link',
    explorer: 'https://etc.blockscout.com',
    testnet: '0',
    chainType: 'EVM'
  },
  {
    name: 'Sepolia Testnet',
    icon: '/images/token-eth.png',
    chainId: '11155111',
    symbol: 'ETH',
    rpc: 'https://ethereum-sepolia.publicnode.com',
    explorer: 'https://sepolia.etherscan.io',
    testnet: '1',
    chainType: 'EVM'
  },
  {
    name: 'BSC Testnet',
    icon: '/images/token-bsc.png',
    chainId: '97',
    symbol: 'BNB',
    rpc: 'https://bsc-testnet-dataseed.bnbchain.org',
    explorer: 'https://testnet.bscscan.com',
    testnet: '1',
    chainType: 'EVM'
  },
  {
    name: 'Bitcoin Testnet4',
    icon: '/images/token-bitcoin-testnet.png',
    chainId: '-2',
    symbol: 'BTC',
    rpc: 'https://mempool.space/testnet4',
    explorer: 'https://mempool.space/testnet4',
    testnet: '1',
    chainType: 'BITCOIN_TESTNET'
  },
  {
    name: 'Bitcoin Regtest',
    icon: '/images/token-bitcoin-regtest.png',
    chainId: '-3',
    symbol: 'BTC',
    rpc: '',
    explorer: '',
    testnet: '1',
    chainType: 'BITCOIN_REGTEST'
  }
]

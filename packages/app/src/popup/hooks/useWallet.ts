import { useRef, useState } from 'react'
import { Storage } from '@luban/wallet-storage'
import type { IAccount } from '../configs/account'
import { LOCAL_CURRENT_ACCOUNT, LOCAL_CURRENT_CHAIN, LOCAL_PREV_CHAIN_ACCOUNT } from '../configs/constant'
import MsgHelper from '../helpers/MsgHelper'
import type { INetwork } from '../configs/network'
import AccountDao from '../dao/AccountDao'
import { log } from '../utils/debug'
import type { BaseTransaction } from '../wallets/IWallet'

export type WalletData = ReturnType<typeof useWallet>

export default function useWallet() {
  const [currentNetwork, setCurrentNetwork] = useState<INetwork | null>(null)
  const [currentAccount, setCurrentAccount] = useState<IAccount | null>(null)
  const txMeta = useRef<BaseTransaction | null>(null)
  const tokenTxMeta = useRef<BaseTransaction | null>(null)

  const setAndCacheCurrentNetworkAndAccount = async (network: INetwork) => {
    const prevKey = LOCAL_PREV_CHAIN_ACCOUNT + network.chainType
    let account = await Storage.getInstance<IAccount>('local').get(prevKey)

    // If there is a account for the network, use it.
    // If there is no account for the network, insert a default account.
    if(account === null) {
      account = await new AccountDao().getOrInsertDefaultAccount(network.chainType)
    }

    if(account === null) {
      log('setAndCacheCurrentNetworkAndAccount failed: account is null')
      return
    }

    await Storage.getInstance('local').batchSet({
      [LOCAL_CURRENT_CHAIN]: network,
      [LOCAL_CURRENT_ACCOUNT]: account,
      [prevKey]: account
    })
    setCurrentNetwork(network)
    setCurrentAccount(account)

    MsgHelper.notify({
      action: 'switch_network',
      data: network
    })
  }

  const setAndCacheAccount = async (account: IAccount) => {
    const prevKey = LOCAL_PREV_CHAIN_ACCOUNT + account.chainType

    // Save current and previous account for the network.
    await Storage.getInstance('local').batchSet({
      [LOCAL_CURRENT_ACCOUNT]: account,
      [prevKey]: account
    })
    setCurrentAccount(account)

    MsgHelper.notify({
      action: 'switch_account',
      data: {
        address: account.address
      }
    })
  }

  return {
    currentNetwork,
    currentAccount,
    txMeta,
    tokenTxMeta,
    setCurrentNetwork,
    setCurrentAccount,
    setAndCacheAccount,
    setAndCacheCurrentNetworkAndAccount
  }
}

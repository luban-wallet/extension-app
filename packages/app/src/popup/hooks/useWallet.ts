import { useRef, useState } from 'react'
import { Storage } from '@luban/wallet-storage'
import type { IAccount } from '../configs/account'
import { LOCAL_CURRENT_ACCOUNT, LOCAL_CURRENT_CHAIN } from '../configs/constant'
import MsgHelper from '../helpers/MsgHelper'
import type { INetwork } from '../configs/network'
import AccountsDao from '../dao/AccountsDao'
import { log } from '../utils/debug'
import type { BaseTransaction } from '../wallets/IWallet'
import PrevChainAccount from '../dao/PrevChainAccount'

export type WalletData = ReturnType<typeof useWallet>

export default function useWallet() {
  const [currentNetwork, setCurrentNetwork] = useState<INetwork | null>(null)
  const [currentAccount, setCurrentAccount] = useState<IAccount | null>(null)
  const txMeta = useRef<BaseTransaction | null>(null)
  const tokenTxMeta = useRef<BaseTransaction | null>(null)

  // const setAndCacheCurrentNetwork = async (network: INetwork, notify = true) => {
  //   await Storage.getInstance('local').set(LOCAL_CURRENT_CHAIN, network)
  //   setCurrentNetwork(network)

  //   if(notify) {
  //     MsgHelper.notify({
  //       action: 'switch_network',
  //       data: network
  //     })
  //   }
  // }

  const setAndCacheCurrentNetworkAndAccount = async (network: INetwork) => {
    const prevDao = new PrevChainAccount()
    let account = await prevDao.getOneByIndex('chainType', network.chainType)

    // If there is a account for the network, use it.
    // Otherwise, get or insert an account for the network.
    if(account === null) {
      account = await new AccountsDao().getOrInsertDefaultAccount(network.chainType)
      if(account !== null) {
        await prevDao.update(account)
      }
    }

    if(account === null) {
      log('setAndCacheCurrentNetworkAndAccount failed: account is null')
      return
    }

    await Storage.getInstance('local').set(LOCAL_CURRENT_CHAIN, network)
    await Storage.getInstance('local').set(LOCAL_CURRENT_ACCOUNT, account)
    setCurrentNetwork(network)
    setCurrentAccount(account)

    MsgHelper.notify({
      action: 'switch_network',
      data: network
    })
  }

  const setAndCacheAccount = async (account: IAccount) => {
    await Storage.getInstance('local').set(LOCAL_CURRENT_ACCOUNT, account)
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
    // setAndCacheCurrentNetwork,
    setCurrentAccount,
    setAndCacheAccount,
    setAndCacheCurrentNetworkAndAccount
  }
}

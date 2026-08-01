import type { INetwork } from "../../../../configs/network"
import { useContext, useState, type MouseEvent } from "react"
import { ActionSheet, ActionSheetContent } from "../../../../components/action-sheet"
import Button from "../../../../components/button"
import ColorIcon from "../../../../components/color-icon"
import NetworkDao from "../../../../dao/NetworkDao"
import IconDown from "../../../../components/icons/down"
import { I18nContext } from "../../../../contexts/I18nContext"
import LinkButton from "../../../../components/link-button"
import IconAdd from "../../../../components/icons/add"
import NetworkItem from "../../../../components/network-item"
import { WalletContext } from "../../../../contexts/WalletContext"

import css from './index.module.css'
import { toast } from "sonner"

export default function NetworkSelect() {
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)
  const { currentNetwork, setAndCacheCurrentNetworkAndAccount } = useContext(WalletContext)!
  const { t } = useContext(I18nContext)!
  const [list, setList] = useState<INetwork[] | null>(null)

  const openDialog = async () => {
    await initNetwork()
    setShow(true)
  }
  const closeDialog = () => {
    setShow(false)
  }

  const initNetwork = async () => {
    // setLoading(true)
    const list = await new NetworkDao().getAll()
    const mainList = []
    if(list !== null) {
      for(const item of list) {
        mainList.push(item)
      }
    }

    setList(mainList)
    // setLoading(false)
  }

  const selectNetwork = async (e: MouseEvent<HTMLElement>) => {
    if(list === null || currentNetwork === null) {
      return
    }
    const t = e.target as HTMLElement
    const id = t.dataset.chain
    if(!id) {
      return
    }

    const network = list.find(i => Number(i.chainId) === Number(id))

    // current network
    if(network === undefined || Number(network.chainId) === Number(currentNetwork.chainId)) {
      closeDialog()
      return
    }

    if(network.rpc === '') {
      toast.error('Network unavailable')
      return
    }

    try {
      setLoading(true)
      // account and network switch
      await setAndCacheCurrentNetworkAndAccount(network)
      closeDialog()
    } catch(e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if(!currentNetwork) {
    return null
  }

  const mainnetList = list?.filter(i => i.testnet === '0')
  const testnetList = list?.filter(i => i.testnet === '1')

  return (
    <>
      <Button className={css.wrapper} onClick={openDialog}>
        <ColorIcon size={20} url={currentNetwork.icon} name={currentNetwork.name} />
        <IconDown width={12} height={12} />
      </Button>

      <ActionSheet open={show} onOpenChange={closeDialog}>
        <ActionSheetContent loading={loading} title={t('page.home.panel.network.pop.title')}>
          <LinkButton to="/home/network-add">
            <IconAdd width={16} height={16} />
            <span>{t('page.home.panel.network.pop.add')}</span>
          </LinkButton>
          <div className={css.networkList} onClick={selectNetwork}>
            {
              mainnetList?.map((item) => (
                <NetworkItem key={item.name} item={item} currentNetwork={currentNetwork} />
              ))
            }

            {
              testnetList !== undefined ? (
                <label className={css.listLabel}>{t('page.home.panel.network.pop.testnetlabel')}</label>
              ) : null
            }
            {
              testnetList?.map((item) => (
                <NetworkItem key={item.name} item={item} currentNetwork={currentNetwork} />
              ))
            }
          </div>
        </ActionSheetContent>
      </ActionSheet>
    </>
  )
}

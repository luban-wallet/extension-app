import { useContext, useEffect, useState } from "react"
import Pageheader from "../../../components/page-header"
import { I18nContext } from "../../../contexts/I18nContext"
import Container, { Column } from "../../../components/container"
import { WalletContext } from "../../../contexts/WalletContext"
import Empty from "../../../components/empty"
import ServiceFactory from "../../../services/ServiceFactory"
import UtxoItem from "./components/item"
import Loading from "../../../components/loading"
import type { IUTXO } from "../../../configs/utxo"
import SwitchTab, { type SwitchItem } from "../../../components/switch-tab"
import Tip from "./components/tip"
import LockedUtxosDao from "../../../dao/LockedUtxosDao"
import { Dialog, DialogContent } from "../../../components/dialog"
import Button from "../../../components/button"
import { log } from "../../../utils/debug"

const TAG = '[Utxos]'
export default function Utxos() {
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)
  const [tab, setTab] = useState(1)
  const { t } = useContext(I18nContext)!
  const { currentAccount, currentNetwork } = useContext(WalletContext)!
  const [list, setList] = useState<IUTXO[]>([])
  const [editingItem, setEditingItem] = useState<IUTXO | null>(null)

  const loadAvailableList = async () => {
    if(currentNetwork === null || currentAccount === null) {
      return
    }

    try {
      setLoading(true)
      const service = ServiceFactory.getService(currentNetwork.chainType)
      const json = await service.getUnspentList(currentNetwork.rpc, currentAccount.address)
      setList(json)
    } catch(e) {
      log(TAG, e)
    } finally {
      setLoading(false)
    }
  }

  const loadLockedList = async () => {
    if(currentAccount === null) {
      return
    }

    try {
      setLoading(true)
      const locked = await new LockedUtxosDao().getAllByIndex('address', currentAccount.address)
      setList(locked)
    } catch(e) {
      log(TAG, e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAvailableList()
  }, [])

  const changeTab = (item: SwitchItem) => {
    setTab(item.value)

    if(item.value === 1) {
      loadAvailableList()
    } else if(item.value === 2) {
      loadLockedList()
    }
  }

  const lock = async () => {
    if(editingItem === null || currentAccount === null) {
      return
    }

    try {
      setPosting(true)
      await new LockedUtxosDao().insert({
        address: currentAccount.address,
        ...editingItem
      })

      // Reload list
      loadAvailableList()
    } catch(e) {
      log(TAG, e)
    } finally {
      setPosting(false)
    }
  }

  const unlock = async () => {
    if(editingItem === null || editingItem.id === undefined) {
      return
    }

    try {
      setPosting(true)
      await new LockedUtxosDao().delete(editingItem.id)

      // Reload list
      loadLockedList()
    } catch(e) {
      log(TAG, e)
    } finally {
      setPosting(false)
    }
  }

  const lockOrUnlock = async () => {
    if(editingItem === null) {
      return
    }

    if(editingItem.id === undefined) {
      await lock()
    } else {
      await unlock()
    }

    setEditingItem(null)
  }

  return (
    <>
      <Pageheader
        title={t('page.utxos.header')}
        slot={<Tip />}
      />
      <Container>
        <div style={{marginBottom: '12px'}}>
          <SwitchTab
            value={tab}
            onChange={changeTab}
            items={[
              {label: t('page.utxos.tabs.available'), value: 1},
              {label: t('page.utxos.tabs.locked'), value: 2}
            ]}
          />
        </div>
        <Column>
          {list.map(item => (
            <UtxoItem
              key={item.txid}
              data={item}
              buttonType={tab}
              onLockOrUnlock={setEditingItem}
            />
          ))}

          {
            loading ? (
              <div style={{display: 'flex', justifyContent: 'center', marginTop: '40px'}}>
                <Loading size={40} />
              </div>
            ) : null
          }
          {
            !loading && list.length === 0 ? (
              <div style={{marginTop: '40px'}}><Empty>{t('common.text.empty')}</Empty></div>
            ) : null
          }
        </Column>
      </Container>

      {
        editingItem !== null ? (
          <Dialog open={true} onOpenChange={() => setEditingItem(null)}>
            <DialogContent title="Confirm">
              <p style={{marginBottom: '12px', fontSize: '14px', marginTop: '8px', lineHeight: '1.5'}}>
                {editingItem.id === undefined
                  ? t('page.utxos.info.lock')
                  : t('page.utxos.info.unlock')
                }
              </p>
              <div style={{marginTop: '32px', display: 'flex', columnGap: '8px'}}>
                <Button
                  onClick={() => setEditingItem(null)}
                >{t('page.utxos.btn.cancel')}</Button>
                <Button
                  variant="primary"
                  disabled={posting}
                  onClick={lockOrUnlock}
                >{t('page.utxos.btn.confirm')}</Button>
              </div>
            </DialogContent>
          </Dialog>
        ) : null
      }
    </>
  )
}

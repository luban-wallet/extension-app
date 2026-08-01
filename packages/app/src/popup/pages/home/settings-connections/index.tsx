import { useContext, useEffect, useState } from 'react'
import Pageheader from '../../../components/page-header'
import { I18nContext } from '../../../contexts/I18nContext'
import Container from '../../../components/container'
import ConnectionsDao from '../../../dao/ConnectionsDao'
import type { IConnection } from '../../../configs/connections'
import ColorIcon from '../../../components/color-icon'
import Button from '../../../components/button'
import IconUnlink from '../../../components/icons/unlink'
import Empty from '../../../components/empty'
import { toast } from 'sonner'

import css from './index.module.css'

export default function SettingsConnections() {
  const [loading, setLoading] = useState(true)
  const { t } = useContext(I18nContext)!
  const [list, setList] = useState<IConnection[] | null>(null)

  useEffect(() => {
    loadList()
  }, [])

  const loadList = async () => {
    const json = await new ConnectionsDao().getAll()
    setList(json)
    setLoading(false)
  }

  const deleteConnection = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const id = e.currentTarget.dataset.id
    if(id === undefined) {
      return
    }

    await new ConnectionsDao().delete(Number(id))
    const filtered = list!.filter(item => item.id !== Number(id))
    setList(filtered)
    toast.success(t('common.msg.op.success'))
  }

  return (
    <>
      <Pageheader title={t('page.settings.connections.header')} />

      <Container footer>
        <div className={css.wrapper}>
        {
          list?.map((item) => (
            <div key={item.id} className={css.item}>
              <div className={css.icon}>
                <ColorIcon size={40} url={item.icon} name={item.name} />
              </div>
              <div>{item.name}</div>
              <div>
                <Button
                  className={css.unlink}
                  data-id={item.id}
                  title={t('page.settings.connections.action.disconnect')}
                  onClick={deleteConnection}
                >
                  <IconUnlink width={20} height={20} />
                </Button>
              </div>
            </div>
          ))
        }

        {
          (!loading && list?.length === 0) ? (
            <div className={css.empty}><Empty>{t('common.text.empty')}</Empty></div>
          ) : null
        }
        </div>
      </Container>
    </>
  )
}

import { useContext, useEffect, useState } from "react"
import Pageheader from "../../../components/page-header"
import { I18nContext } from "../../../contexts/I18nContext"
import Container, { Column } from "../../../components/container"
import Button from "../../../components/button"
import { WalletContext } from "../../../contexts/WalletContext"
import Footer from "../../../components/footer"
import TxItem from "./components/item/Item"
import type { ITransaction } from "../../../configs/transaction"
import TransactionDao from "../../../dao/TransactionDao"
import Empty from "../../../components/empty"
import Tip from "./components/tip"
import DetailDialog from "./components/detail-dialog"

const PAGE_SIZE = 10
export default function Activities() {
  const { t } = useContext(I18nContext)!
  const { currentAccount, currentNetwork } = useContext(WalletContext)!
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [list, setList] = useState<ITransaction[]>([])
  const [selectedItem, setSelectedItem] = useState<ITransaction | null>(null)

  const loadList = async (page: number) => {
    const json = await new TransactionDao().getListByPageAndIndex(
      page,
      PAGE_SIZE,
      'chainId',
      currentNetwork?.chainId ?? ''
    )

    const oldLength = list.length
    setPage(page)
    setLoading(false)
    setHasMore(json.data.length + oldLength < json.total)
    setList(list.concat(json.data))
  }

  const loadMore = () => {
    loadList(page + 1)
  }

  useEffect(() => {
    loadList(1)
  }, [])

  const view = () => {
    const baseUrl = currentNetwork?.explorer ?? ''
    if(baseUrl === '') {
      return
    }

    const to = baseUrl + '/address/' + currentAccount?.address
    globalThis.open(to, '_blank')
  }

  const selectItem = (data: ITransaction) => {
    setSelectedItem(data)
  }

  return (
    <>
      <Pageheader title={t('page.activity.header')} />
      <Container>
        <Column>
        {list.map((item) => <TxItem key={item.id} data={item} onSelect={selectItem} />)}

        {
          !loading && list.length === 0 ? (
            <div style={{marginTop: '40px'}}><Empty>{t('common.text.empty')}</Empty></div>
          ) : null
        }
        {
          hasMore ? (
            <Button variant="ghost" onClick={loadMore}>{t('page.activity.text.loadmore')}</Button>
          ) : null
        }
        </Column>
      </Container>
      <Footer>
        <Tip />
        <Button onClick={view}>{t('page.activity.text.view')}</Button>
      </Footer>

      {/* Detail Dialog */}
      {
        selectedItem === null ? null : (
          <DetailDialog
            data={selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        )
      }
    </>
  )
}

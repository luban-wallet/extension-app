import { useContext } from "react"
import Pageheader from "../../../components/page-header"
import { I18nContext } from "../../../contexts/I18nContext"
import Container from "../../../components/container"
import Button from "../../../components/button"
import { WalletContext } from "../../../contexts/WalletContext"

export default function Activities() {
  const { t } = useContext(I18nContext)!
  const { currentAccount, currentNetwork } = useContext(WalletContext)!

  const view = () => {
    const baseUrl = currentNetwork?.explorer ?? ''
    const to = baseUrl + '/address/' + currentAccount?.address
    globalThis.open(to, '_blank')
  }

  return (
    <>
      <Pageheader title={t('page.activity.header')} />

      <Container>
        <Button onClick={view}>{t('page.activity.text.view')}</Button>
      </Container>
    </>
  )
}

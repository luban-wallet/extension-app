import { useContext } from "react"
import Pageheader from "../../../../components/page-header"
import { I18nContext } from "../../../../contexts/I18nContext"
import Container from "../../../../components/container"
import Row from "../../../../components/row"
import CopyText from "../../../../components/copy-text"
import { formatAddress } from "../../../../utils/util"
import Divider from "../../../../components/divider"

import css from './index.module.css'

const ETHEREUM_ADDRESS = '0xBb4ff4a9E82D0057162787D999566a563523B428'

export default function About() {
  const { t } = useContext(I18nContext)!

  return (
    <>
      <Pageheader title={t('page.about.header')} />
      <Container>
        <div className={css.wrapper}>
          <img src="/logo.png" width="80" height="80" />
          <h2 className={css.title}>{t('common.brand.title')}</h2>
          <p className={css.describe}>
            <span>{t('page.about.description')}</span>
          </p>
          <div className={css.meta}>
            <Row label="Donate"></Row>
            <Divider />
            <Row label="Ethereum">
              <div className={css.address}>
                <span>{formatAddress(ETHEREUM_ADDRESS)}</span>
                <CopyText size={20} value={ETHEREUM_ADDRESS} />
              </div>
            </Row>
          </div>
        </div>
      </Container>
    </>
  )
}

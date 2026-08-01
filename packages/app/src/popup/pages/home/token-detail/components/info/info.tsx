import { useContext } from 'react'
import type { IToken } from '../../../../../configs/token'
import { formatUnits } from '../../../../../utils/util'
import { I18nContext } from '../../../../../contexts/I18nContext'
import Row from '../../../../../components/row'

export default function Item(props: {token: IToken | null}) {
  const { token } = props
  const { t } = useContext(I18nContext)!

  return (
    <section style={{marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px'}}>
      <Row label={t('page.token.info.name')}>{token?.name}</Row>
      <Row label={t('page.token.info.symbol')}>{token?.symbol}</Row>
      <Row label={t('page.token.info.decimals')}>{token?.decimals}</Row>
      <Row label={t('page.token.info.totalsupply')}>{formatUnits(token?.totalSupply ?? '0', Number(token?.decimals))}</Row>
    </section>
  )
}

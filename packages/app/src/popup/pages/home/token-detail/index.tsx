import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import ColorIcon from '../../../components/color-icon'
import CopyText from '../../../components/copy-text'
import IconReceive from '../../../components/icons/receive'
import IconSend from '../../../components/icons/send'
import Pageheader from '../../../components/page-header'
import TextTab from '../../../components/text-tab'
import Info from './components/info/info'
import { TokenContext } from '../../../contexts/TokenContext'
import { formatAddress, formatUnits } from '../../../utils/util'
import { I18nContext } from '../../../contexts/I18nContext'
import type { IToken } from '../../../configs/token'
import LinkButton from '../../../components/link-button'
import Container from '../../../components/container'
import TokenDao from '../../../dao/TokenDao'
import ServiceFactory from '../../../services/ServiceFactory'
import { WalletContext } from '../../../contexts/WalletContext'

import css from './index.module.css'

const TABS = ['Info']

export default function Token() {
  const { currentAccount, currentNetwork } = useContext(WalletContext)!
  const { setCachedBalance } = useContext(TokenContext)!
  const { t } = useContext(I18nContext)!
  const [balance, setBalance] = useState('')
  const [token, setToken] = useState<IToken | null>(null)
  const params = useParams()

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    if(currentNetwork === null || currentAccount === null || params.id === undefined) {
      return
    }

    // console.log(tokens)
    const token = await new TokenDao().getOne(Number(params.id))
    if(token === null) {
      return
    }
    setToken(token)

    try {
      const service = ServiceFactory.getService(currentNetwork.chainType)
      const balance = await service.getTokenBalance(currentNetwork.rpc, token.contract, currentAccount.address)
      setCachedBalance(token.id!, currentAccount.address, balance)
      setBalance(balance)
    } catch(e) {
      console.error(e)
    }
  }

  return (
    <>
      <Pageheader title={t('page.token.header')} />
      <Container>
        <div className={css.tokenInfo}>
          <ColorIcon size={56} font={24} name={token?.symbol ?? ''} />
          <div className={css.tokenInfoMain}>
            <h4 className={css.tokenInfoName}>{token?.symbol ?? ''}</h4>
            <div className={css.tokenInfoAddress}>
              <span>{formatAddress(token?.contract ?? '')}</span>
              <CopyText size={16} value={token?.contract ?? ''} />
            </div>
          </div>
        </div>
        <div className={css.tokenMeta}>
          <div className={css.tokenMetaItem}>
            <label>Balance</label>
            <span>{formatUnits(balance, Number(token?.decimals ?? 0))} {token?.symbol ?? ''}</span>
          </div>
        </div>
        <div className={css.actions}>
          <LinkButton variant="button" to="/home/receive" className={css.actionBtn}>
            <IconReceive width={16} height={16} />
            <span>{t('page.token.btn.receive')}</span>
          </LinkButton>
          <LinkButton variant="button" to={`/home/send-token?id=${token?.id}`} className={css.actionBtn}>
            <IconSend width={16} height={16} />
            <span>{t('page.token.btn.send')}</span>
          </LinkButton>
        </div>

        <div className={css.tabs}>
          <TextTab list={TABS} current='Info' />
          <Info token={token} />
        </div>
      </Container>
    </>
  )
}

import { useContext, useEffect, useState } from 'react'
import AssetItem from '../../../../components/asset-item'
import Empty from '../../../../components/empty'
import { I18nContext } from '../../../../contexts/I18nContext'
import TokenDao from '../../../../dao/TokenDao'
import { TokenContext } from '../../../../contexts/TokenContext'
import type { IToken } from '../../../../configs/token'
import { log } from '../../../../utils/debug'
import { WalletContext } from '../../../../contexts/WalletContext'
import HomeAssetsButtons from '../../../../components-oo/home-assets-buttons'

import css from './index.module.css'

const TAG = '[AssetList]'

export default function AssetList() {
  const [loading, setLoading] = useState(true)
  const { t } = useContext(I18nContext)!
  const { currentNetwork } = useContext(WalletContext)!
  const { getCachedTokens, setCachedTokens } = useContext(TokenContext)!
  const [tokens, setTokens] = useState<IToken[] | null>(null)

  useEffect(() => {
    initList()
  }, [currentNetwork?.chainId])

  const initList = async () => {
    if(currentNetwork === null) {
      return
    }

    const chainId = currentNetwork.chainId
    const tokens = getCachedTokens(chainId)
    if(tokens !== null && tokens !== undefined) {
      log(TAG, 'use cached tokens')
      setTokens(tokens)
      setLoading(false)
      return
    }

    const list = await new TokenDao().getAllByIndex('chainId', currentNetwork.chainId)
    setCachedTokens(chainId, list)
    setTokens(list)
    setLoading(false)
  }

  return (
    <div className={css.wrapper}>
      <div className={css.header}>
        <b>{t('page.home.asset.title')}</b>
        <div className={css.headerActions}>
          <HomeAssetsButtons />
        </div>
      </div>

      <div className={css.list}>
        {/* {
          loading ? <Loading /> : null
        } */}
        {
          (!loading && (tokens === null || tokens.length === 0)) ?
          <div style={{marginTop: '40px'}}><Empty>{t('page.home.asset.empty')}</Empty></div>
          : null
        }
        {
          tokens?.map((item) => (
            <AssetItem
              key={item.symbol}
              token={item}
            />
          ))
        }
      </div>
    </div>
  )
}

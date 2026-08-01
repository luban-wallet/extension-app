import { useContext, useEffect, useState, type MouseEvent } from "react"
import Button from "../button"
import ColorIcon from "../color-icon"
import IconDown from "../icons/down"
import type { IToken } from "../../configs/token"
import TokenDao from "../../dao/TokenDao"
import { ActionSheet, ActionSheetContent } from "../action-sheet"
import { I18nContext } from "../../contexts/I18nContext"
import { TokenContext } from "../../contexts/TokenContext"
import { formatUnits } from "../../utils/util"
import CheckIcon from "../check-icon"
import ServiceFactory from "../../services/ServiceFactory"
import { WalletContext } from "../../contexts/WalletContext"

import css from './index.module.css'

interface IProps {
  tokenId: string
  onSelect: (token: IToken, balance: string) => void
}

export default function TokenSelect(props: IProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [currentToken, setCurrentToken] = useState<IToken | null>(null)
  const [list, setList] = useState<IToken[] | null>(null)
  const { t } = useContext(I18nContext)!
  const { currentAccount, currentNetwork } = useContext(WalletContext)!
  const { getCachedBalance, setCachedBalance } = useContext(TokenContext)!
  const [balance, setBalance] = useState('')
  const { tokenId } = props

  useEffect(() => {
    init()
  }, [])

  const loadBalance = async (token: IToken) => {
    if(currentNetwork === null || currentAccount === null) {
      return
    }

    try {
      setBalance('')
      const service = ServiceFactory.getService(currentNetwork.chainType)
      const balance = await service.getTokenBalance(currentNetwork.rpc, token.contract, currentAccount.address)

      setCachedBalance(token.id!, currentAccount.address, balance)
      setBalance(balance)
      props.onSelect(token, balance)
    } catch(e) {
      console.error(e)
    }
  }

  const init = async () => {
    if(currentNetwork === null) {
      return
    }

    const tokens = await new TokenDao().getAllByIndex('chainId', currentNetwork.chainId)
    if(tokens === null || tokens.length === 0) {
      return
    }
    let token = tokens.find(t => t.id === Number(tokenId))
    if(token === undefined) {
      token = tokens[0]
    }

    setCurrentToken(token)
    setList(tokens)
    loadBalance(token)
  }

  const openDialog = () => {
    setShowDialog(true)
  }
  const closeDialog = () => {
    setShowDialog(false)
  }

  const selectToken = (e: MouseEvent<HTMLElement>) => {
    if(list === null) {
      return
    }
    const t = e.target as HTMLElement
    const id = t.dataset.id
    if(!id) {
      return
    }

    const token = list.find(i => i.id === Number(id))
    if(token !== undefined && token.id !== currentToken?.id) {
      setCurrentToken(token)
      loadBalance(token)
    }
    closeDialog()
  }

  return (
    <>
      <Button variant="ghost" className={css.wrapper} onClick={openDialog}>
        <div className={css.left}>
          <ColorIcon size={24} name={currentToken?.symbol ?? ''} />
          <span>{currentToken?.symbol}</span>
        </div>
        <div className={css.right}>
          <div>{formatUnits(balance, Number(currentToken?.decimals))}</div>
          <IconDown width={12} height={12} />
        </div>
      </Button>

      <ActionSheet open={showDialog} onOpenChange={closeDialog}>
        <ActionSheetContent title={t('component.selecttoken.header')}>
          <div className={css.tokenList} onClick={selectToken}>
            {
              list?.map((item) => (
                <Button key={item.id} data-id={item.id} className={css.tokenItem}>
                  <div className={css.tokenItemIcon}>
                    <ColorIcon size={40} name={item.symbol} />
                  </div>
                  <div data-id={item.id} className={css.tokenItemName}>
                    <b>{item.symbol}</b>
                    {
                      getCachedBalance(item.id!, currentAccount?.address ?? '') !== undefined ? (
                        <p>{formatUnits(
                            getCachedBalance(item.id!, currentAccount?.address ?? '') ?? '',
                            Number(item.decimals)
                        )} {item.symbol}</p>
                      ) : null
                    }
                  </div>
                  {
                    currentToken?.id === item.id ? (
                      <CheckIcon />
                    ) : null
                  }
                </Button>
              ))
            }
          </div>
        </ActionSheetContent>
      </ActionSheet>
    </>
  )
}

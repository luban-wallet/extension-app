import type { INetwork } from "../../configs/network"
import Button from "../button"
import CheckIcon from "../check-icon"
import ColorIcon from "../color-icon"

import css from './index.module.css'

export default function NetworkItem(props: { item: INetwork, currentNetwork: INetwork }) {
  const { item, currentNetwork } = props
  return (
    <Button className={css.networkItem}>
      <div className={css.networkItemMask} data-chain={item.chainId}></div>
      <div className={css.networkItemIcon}>
        <ColorIcon size={32} name={item.name} url={item.icon} />
      </div>
      <span className={css.networkItemName}>{item.name}</span>
      {
        BigInt(currentNetwork.chainId) === BigInt(item.chainId) ? (
          <CheckIcon />
        ) : null
      }
    </Button>
  )
}

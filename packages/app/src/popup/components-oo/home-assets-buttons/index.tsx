import { lazy } from "react"
import Base from "../Base"

const Evm = lazy(() => import('./evm'))

export default class HomeAssetsButtons<T> extends Base<T> {
  protected Components = {
    EVM: Evm,
    BITCOIN: null,
    BITCOIN_TESTNET: null,
    BITCOIN_REGTEST: null,
  }
}

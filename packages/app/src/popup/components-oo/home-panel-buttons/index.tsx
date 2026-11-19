import { lazy } from "react"
import Base from "../Base"

const Evm = lazy(() => import('./evm'))
// const Btc = lazy(() => import('./btc'))

export default class HomePanelButtons<T> extends Base<T> {
  protected Components = {
    EVM: Evm,
    BITCOIN: Evm,
    BITCOIN_TESTNET: Evm,
    BITCOIN_REGTEST: Evm,
    SVM: Evm
  }
}

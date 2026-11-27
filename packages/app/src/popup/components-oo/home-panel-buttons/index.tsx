import { lazy } from "react"
import Base from "../Base"

const Evm = lazy(() => import('./evm'))
const Svm = lazy(() => import('./svm'))

export default class HomePanelButtons<T> extends Base<T> {
  protected Components = {
    EVM: Evm,
    BITCOIN: Evm,
    BITCOIN_TESTNET: Evm,
    BITCOIN_REGTEST: Evm,
    SVM: Svm
  }
}

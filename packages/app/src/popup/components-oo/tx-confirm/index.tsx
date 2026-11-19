import { lazy } from "react"
import Base from "../Base"
import type { IProps } from "./type"

const Evm = lazy(() => import('./evm'))
const Btc = lazy(() => import('./btc'))
const Svm = lazy(() => import('./svm'))

export default class TxConfirm<T extends IProps> extends Base<T> {
  protected Components = {
    EVM: Evm,
    BITCOIN: Btc,
    BITCOIN_TESTNET: Btc,
    BITCOIN_REGTEST: Btc,
    SVM: Svm,
  }
}

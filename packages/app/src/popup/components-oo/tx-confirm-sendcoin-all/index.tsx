import { lazy } from "react"
import Base from "../Base"
import type { IProps } from "./type"

const Evm = lazy(() => import('./evm'))

export default class TxConfirmSendCoinAll<T = IProps> extends Base<T> {
  protected Components = {
    EVM: Evm,
    BITCOIN: null,
    BITCOIN_TESTNET: null,
    BITCOIN_REGTEST: null,
    SVM: null,
  }
}

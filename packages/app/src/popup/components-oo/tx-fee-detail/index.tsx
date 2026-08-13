import { lazy } from "react"
import Base from "../Base"
import type { IProps } from "./type"

const Evm = lazy(() => import('./evm'))

export default class TxFeeDetail<T extends IProps> extends Base<T> {
  protected Components = {
    EVM: Evm,
    BITCOIN: null,
    BITCOIN_TESTNET: null,
    BITCOIN_REGTEST: null,
  }
}

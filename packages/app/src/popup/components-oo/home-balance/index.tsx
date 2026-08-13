import { lazy } from "react"
import Base from "../Base"

const Evm = lazy(() => import('./evm'))
const Btc = lazy(() => import('./btc'))

export default class HomeBalance<T> extends Base<T> {
  protected Components = {
    EVM: Evm,
    BITCOIN: Btc,
    BITCOIN_TESTNET: Btc,
    BITCOIN_REGTEST: Btc,
  }
}

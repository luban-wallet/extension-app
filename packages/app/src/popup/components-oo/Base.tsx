import { Component, Suspense, type JSX } from 'react'
import { WalletContext } from "../contexts/WalletContext"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LayzComponent = null | React.LazyExoticComponent<(props?: any) => JSX.Element | null>

export default abstract class Base<T> extends Component<T> {
  declare context: React.ContextType<typeof WalletContext>
  static contextType = WalletContext

  protected abstract Components: {
    'EVM': LayzComponent,
    'BITCOIN': LayzComponent,
    'BITCOIN_TESTNET': LayzComponent,
    'BITCOIN_REGTEST': LayzComponent
  }

  render() {
    const { currentNetwork } = this.context!
    if(currentNetwork === null) {
      return null
    }

    const Component = this.Components[currentNetwork.chainType]
    return (
      Component
        ? <Suspense><Component {...this.props} /></Suspense>
        : null
    )
  }
}

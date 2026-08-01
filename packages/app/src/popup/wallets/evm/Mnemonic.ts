import type IMnemonic from '../IMnemonic'
import { entropyToMnemonic } from 'bip39'
import Crypto from '@lubankit/crypto'

export default class Mnemonic implements IMnemonic {
  public createPhrase(count: number): string {
    const byteLength = count === 12 ? 16 : 32
    const entropy = Crypto.getInstance().randomBytes(byteLength)

    return entropyToMnemonic(entropy as Buffer)
  }

  public createPhraseFromEntropy(entropy: Uint8Array<ArrayBufferLike>): string {
    return entropyToMnemonic(entropy as Buffer)
  }
}

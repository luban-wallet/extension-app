export default interface IMnemonic {
  /**
   * Create a mnemonic phrase randomly
   *
   * @param {number} count The number of words in the phrase (12 or 24)
   */
  createPhrase(count: number): string

  /**
   * Create a mnemonic phrase from entropy
   *
   * @param {Uint8Array} entropy The entropy to generate the phrase from
   */
  createPhraseFromEntropy(entropy: Uint8Array<ArrayBufferLike>): string
}

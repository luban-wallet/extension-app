import { ethers } from 'ethers'
import { networkUnits, type ChainType } from '../configs/network'

export async function copyText(text: string): Promise<void> {
  try {
    await globalThis.navigator.clipboard.writeText(text)
  } catch(e) {
    console.error('Copy failed', e)
  }
}

export function getColor(str: string): string {
  if(!str) {
    return 'rgba(0, 0, 0, 1)'
  }

  let asciiSum = 0;
  for (let i = 0; i < str.length; i++) {
    asciiSum += str.charCodeAt(i);
  }
  const r = Math.abs(Math.round(Math.sin(asciiSum) * 255)).toString()
  const g = Math.abs(Math.round(Math.sin(asciiSum + 1) * 255)).toString()
  const b = Math.abs(Math.round(Math.sin(asciiSum + 2) * 255)).toString()

  return `rgba(${r}, ${g}, ${b}, 1)`
}

/**
 * Convert value to minimal unit (e.g. ETH to wei)
 */
export function toMinimalUnit(value?: string, chainType?: ChainType): bigint {
  if(!value || !chainType) {
    return 0n
  }

  const unit = networkUnits[chainType].valueDecimal
  return ethers.parseUnits(value, unit)
}

/**
 * Convert value to maximal unit (e.g. wei to ETH)
 */
export function toMaximalUnit(value?: string, chainType?: ChainType): string {
  if(!value || !chainType) {
    return ''
  }

  const unit = networkUnits[chainType].valueDecimal
  return ethers.formatUnits(value, unit)
}

/**
 * Format units with specified decimals (e.g. wei to Gwei)
 */
export function formatUnits(value?: string, decimals?: number): string {
  if(!value || !decimals) {
    return ''
  }
  return ethers.formatUnits(value, decimals)
}

/**
 * Parse units with specified decimals (e.g. Gwei to wei)
 */
export function parseUnits(balance: string, decimals: number): bigint {
  if(!balance || !decimals) {
    return 0n
  }
  return ethers.parseUnits(balance, decimals)
}

export function formatAddress(address?: string, show = 16): string {
  if(!address) {
    return ''
  }

  const half = Math.floor(show * 0.5)
  const len = address.length
  if (len <= show) {
    return address
  }

  return address.substring(0, half) + '...' + address.substring(len - half)
}

export function stringToHex(message: string): string {
  let hex = ''
  for(let i = 0, code = 0; i < message.length; i++) {
    code = message.charCodeAt(i)
    hex += code.toString(16).padStart(2, '0')
  }
  return hex
}

export function hexToString(hex: string): string {
  let str = ''
  if(hex.startsWith('0x')) {
    hex = hex.substring(2)
  }
  for(let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode( parseInt(hex.substring(i, i + 2), 16) )
  }
  return str
}

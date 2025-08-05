import { describe, expect, it } from 'vitest'
import { DEFAULT_ADDITIONAL_CONFIG } from '../core/api'
import { makeApiUrl } from './url'

const CONFIG = DEFAULT_ADDITIONAL_CONFIG
describe('url util', () => {
  it('should, given an array of parts return a complete url', () => {
    const url = makeApiUrl(['hello', 'world'], CONFIG)
    expect(url.href).toBe('https://api.apimo.pro/hello/world')
  })

  it('should, given an array of parts and search params return a complete url', () => {
    const url = makeApiUrl(['hello', 'world'], CONFIG, { culture: 'fr', limit: 10 })
    expect(url.href).toBe('https://api.apimo.pro/hello/world?culture=fr&limit=10')
  })

  it('should, given an array of parts and search params with undefined values, ignore them', () => {
    const url = makeApiUrl(['hello', 'world'], CONFIG, { culture: 'fr', limit: undefined })
    expect(url.href).toBe('https://api.apimo.pro/hello/world?culture=fr')
  })
})

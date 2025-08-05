import { afterEach, describe, expect, it, vi } from 'vitest'
import { Api, DEFAULT_BASE_URL } from './api'

describe('api', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('should accept a provider, a token and a base config', () => {
    const api = new Api('393', 'TOKEN')
    expect(api).toBeInstanceOf(Api)
  })

  it('should have the right authorization headers when fetching', async () => {
    const api = new Api('provider', 'token')
    vi.stubGlobal('fetch', vi.fn())
    await api.fetch(DEFAULT_BASE_URL)
    expect(globalThis.fetch).toHaveBeenCalledExactlyOnceWith(
      DEFAULT_BASE_URL,
      {
        headers: {
          Authorization: 'Basic cHJvdmlkZXI6dG9rZW4=', // = boa("provider:token")
        },
      },
    )
  })
})

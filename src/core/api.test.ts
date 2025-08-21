import type {MockedFunction} from 'vitest'
import {afterEach, beforeEach, describe, expect, it as defaultIt, vi} from 'vitest'
import type {CatalogName} from '../consts/catalogs'
import type {ApiCulture} from '../consts/languages'
import {z} from 'zod'
import {DummyCache} from '../services/storage/dummy.cache'
import {MemoryCache} from '../services/storage/memory.cache'
import {Apimo, DEFAULT_BASE_URL} from './api'

// Mock fetch globally
const mockFetch = vi.fn() as MockedFunction<typeof fetch>

interface ResponseMockerConfig {
  ok?: boolean
  status?: number
  json?: () => any
}

type ResponseMocker = (config?: ResponseMockerConfig) => void

const PROVIDER = '0'
const TOKEN = 'TOKEN'

const BasicAuthHeaders = {
  Authorization: `Basic ${btoa(`${PROVIDER}:${TOKEN}`)}`,
}

const it = defaultIt.extend<{
  api: Apimo
  mockResponse: ResponseMocker
}>({
  // eslint-disable-next-line no-empty-pattern
  api: async ({}, use) => {
    let api: Apimo | null = new Apimo('0', 'TOKEN', {
      catalogs: {
        transform: {
          active: false,
        },
      },
    })
    await use(api)
    api = null
  },
  // eslint-disable-next-line no-empty-pattern
  mockResponse: async ({}, use) => {
    const mockResponse: ResponseMocker = (config) => {
      mockFetch.mockResolvedValue({
        ok: config?.ok ?? true,
        status: config?.status ?? 200,
        json: config?.json ? vi.fn().mockResolvedValue(config.json()) : vi.fn().mockResolvedValue({}),
        text: vi.fn(),
        headers: new Headers(),
        statusText: 'OK',
        url: '',
        redirected: false,
        type: 'basic',
        body: null,
        bodyUsed: false,
        clone: vi.fn(),
        arrayBuffer: vi.fn(),
        blob: vi.fn(),
        formData: vi.fn(),
      } as unknown as Response)
    }
    await use(mockResponse)
  },
})

describe('api', () => {
  let mockResponse: Response

  beforeEach(() => {
    // Mock global fetch
    vi.stubGlobal('fetch', mockFetch)

    // Create a mock response object
    mockResponse = {
      ok: true,
      status: 200,
      json: vi.fn(),
      text: vi.fn(),
      headers: new Headers(),
      statusText: 'OK',
      url: '',
      redirected: false,
      type: 'basic',
      body: null,
      bodyUsed: false,
      clone: vi.fn(),
      arrayBuffer: vi.fn(),
      blob: vi.fn(),
      formData: vi.fn(),
    } as unknown as Response

    mockFetch.mockResolvedValue(mockResponse)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  describe('constructor', () => {
    it('should accept a provider, a token and a base config', ({api}) => {
      expect(api).toBeInstanceOf(Apimo)
    })

    it('should use default config when no additional config provided', ({api}) => {
      expect(api.config).toStrictEqual({
        baseUrl: DEFAULT_BASE_URL,
        culture: 'en' as ApiCulture,
        catalogs: {
          cache: {
            active: true,
            adapter: expect.any(MemoryCache),
          },
          transform: {
            active: false,
          },
        },
      })
    })

    it('should merge custom config with defaults', () => {
      const testApi = new Apimo('provider', 'token', {
        baseUrl: 'https://custom.api.com',
        culture: 'fr' as ApiCulture,
        catalogs: {
          cache: {
            active: false,
            adapter: new DummyCache(),
          },
        },
      })

      expect(testApi.config).toStrictEqual({
        baseUrl: 'https://custom.api.com',
        culture: 'fr',
        catalogs: {
          cache: {
            active: false,
            adapter: expect.any(DummyCache),
          },
          transform: {
            active: true,
          },
        },
      })
    })

    it('should use provided cache adapter', () => {
      const testApi = new Apimo('provider', 'token', {
        catalogs: {
          cache: {
            adapter: new DummyCache(),
          },
        },
      })
      expect(testApi.cache).toBeInstanceOf(DummyCache)
    })

    it('should use DummyCache when cache is not active', () => {
      const testApi = new Apimo('provider', 'token', {
        catalogs: {
          cache: {
            active: false,
            adapter: new MemoryCache(),
          },
        },
      })
      expect(testApi.cache).toBeInstanceOf(DummyCache)
    })
  })

  describe('fetch', () => {
    it('should have the right authorization headers when fetching', async () => {
      const testApi = new Apimo('provider', 'token')
      await testApi.fetch(DEFAULT_BASE_URL)

      expect(mockFetch).toHaveBeenCalledExactlyOnceWith(
        DEFAULT_BASE_URL,
        {
          headers: {
            Authorization: `Basic ${btoa('provider:token')}`,
          },
        },
      )
    })

    it('should merge additional headers with authorization', async ({api}) => {
      const customHeaders = {'Content-Type': 'application/json'}
      await api.fetch(DEFAULT_BASE_URL, {headers: customHeaders})

      expect(mockFetch).toHaveBeenCalledWith(
        DEFAULT_BASE_URL,
        {
          headers: {
            ...BasicAuthHeaders,
            'Content-Type': 'application/json',
          },
        },
      )
    })

    it('should pass through other fetch options', async ({api}) => {
      const options = {
        method: 'POST',
        body: JSON.stringify({test: 'data'}),
        headers: {'Custom-Header': 'value'},
      }

      await api.fetch(DEFAULT_BASE_URL, options)

      expect(mockFetch).toHaveBeenCalledWith(
        DEFAULT_BASE_URL,
        {
          method: 'POST',
          body: JSON.stringify({test: 'data'}),
          headers: {
            ...BasicAuthHeaders,
            'Custom-Header': 'value',
          },
        },
      )
    })

    it('should handle rate limiting with Bottleneck', async ({api}) => {
      // Make multiple concurrent requests to test rate limiting
      const promises = Array.from({length: 3}, () => api.fetch(DEFAULT_BASE_URL))
      await Promise.all(promises)

      expect(mockFetch).toHaveBeenCalledTimes(3)
    })
  })

  describe('get', () => {
    it('should fetch and parse according to the specified schema', async ({mockResponse, api}) => {
      mockResponse({
        json: () => ({success: true}),
      })

      const spy = vi.spyOn(api, 'fetch')
      await api.get(['path', 'to', 'catalogs'], z.object({success: z.boolean()}), {culture: 'en'})
      expect(spy).toHaveBeenCalledExactlyOnceWith(
        new URL('https://api.apimo.pro/path/to/catalogs?culture=en'),
      )
    })
  })

  describe('populateCache', () => {
    it('should populate cache without returning entry when no id provided', async ({api, mockResponse}) => {
      const catalogName: CatalogName = 'property_type'
      const culture: ApiCulture = 'en'
      const mockEntries = [
        {id: 1, name: 'Apartment', name_plurial: 'Apartments'},
        {id: 2, name: 'House', name_plurial: 'Houses'},
      ]

      mockResponse({
        json: () => mockEntries,
      })

      const result = await api.populateCache(catalogName, culture)

      expect(result).toBeUndefined()
      expect(mockFetch).toHaveBeenCalledExactlyOnceWith(
        new URL(`https://api.apimo.pro/catalogs/${catalogName}?culture=${culture}`),
        {
          headers: BasicAuthHeaders,
        },
      )
    })

    it('should populate cache and return specific entry when id provided', async ({api, mockResponse}) => {
      const catalogName: CatalogName = 'property_type'
      const culture: ApiCulture = 'en'
      const mockEntries = [
        {id: 1, name: 'Apartment', name_plurial: 'Apartments'},
        {id: 2, name: 'House', name_plurial: 'Houses'},
      ]

      mockResponse({
        json: () => mockEntries,
      })

      const result = await api.populateCache(catalogName, culture, 1)

      expect(result).toEqual({
        name: 'Apartment',
        namePlural: 'Apartments',
      })
    })

    it('should return null when requested id not found', async ({api, mockResponse}) => {
      const catalogName: CatalogName = 'property_type'
      const culture: ApiCulture = 'en'
      const mockEntries = [
        {id: 1, name: 'Apartment', name_plurial: 'Apartments'},
      ]

      mockResponse({json: () => mockEntries})

      const result = await api.populateCache(catalogName, culture, 999)

      expect(result).toBeNull()
    })
  })
})

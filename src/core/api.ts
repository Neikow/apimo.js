import type { CatalogName } from '../consts/catalogs'
import type { ApiCulture } from '../consts/languages'
import type { CatalogDefinition, CatalogEntry, CatalogTransformer, LocalizedCatalogTransformer } from '../schemas/common'
import type { ApiCacheAdapter, CatalogEntryName } from '../services/storage/types'
import type { DeepPartial } from '../types'
import type { ApiSearchParams } from '../utils/url'
import Bottleneck from 'bottleneck'
import { merge } from 'merge-anything'
import { z } from 'zod'
import { getAgencySchema } from '../schemas/agency'
import { CatalogDefinitionSchema, CatalogEntrySchema } from '../schemas/common'
import { getPropertySchema } from '../schemas/property'
import { DummyCache } from '../services/storage/dummy.cache'
import { MemoryCache } from '../services/storage/memory.cache'
import { CacheExpiredError } from '../services/storage/types'
import { makeApiUrl } from '../utils/url'

/**
 * ApiConfig
 * ---
 *
 * The general config, used to create an API wrapper. It exports major endpoints as methods.
 * Internally, it's a simple wrapper to node:fetch with a neater syntax.
 */
export interface AdditionalConfig {
  // Base path for API access. Defaults to "https://api.apimo.pro/".
  baseUrl: string
  // The default language to use when none is provided. Translates to "culture" in the API.
  culture: ApiCulture
  // Catalog related configuration
  catalogs: {
    // Caching of catalogs, for faster transformation
    cache: {
      // Whether to use the catalog caching. A value of false means that catalogs won't be cached. You will need to supply your own `catalogs.transform.transformFn`.
      active: boolean
      // Where to store the catalogs cache. Currently only file is supported.
      adapter: ApiCacheAdapter
    }
    // Catalog transformation related configuration
    transform: {
      // Whether to use the catalog transformation. A value of false will apply an identity function to the catalog ids.
      active: boolean
      // If provided, the function that will replace the default catalog transformer function.
      transformFn?: CatalogTransformer
    }
  }
}

export const DEFAULT_BASE_URL = 'https://api.apimo.pro'

export const DEFAULT_ADDITIONAL_CONFIG: AdditionalConfig = {
  baseUrl: DEFAULT_BASE_URL,
  culture: 'en',
  catalogs: {
    cache: {
      active: true,
      adapter: new MemoryCache(),
    },
    transform: {
      active: true,
    },
  },
}

export class Apimo {
  readonly config: AdditionalConfig
  readonly cache: ApiCacheAdapter
  readonly limiter: Bottleneck

  constructor(
    // The site identifier, in a string of numbers format. You can request yours by contacting Apimo.net customer service.
    private readonly provider: string,
    // The secret token for API authentication
    private readonly token: string,
    // Additional config, to tweak how the API is handled
    config: DeepPartial<AdditionalConfig> = DEFAULT_ADDITIONAL_CONFIG,
  ) {
    this.config = merge(DEFAULT_ADDITIONAL_CONFIG, config) as AdditionalConfig
    this.cache = this.config.catalogs.cache.active ? this.config.catalogs.cache.adapter : new DummyCache()
    this.limiter = new Bottleneck({
      reservoir: 10,
      reservoirRefreshAmount: 10,
      reservoirRefreshInterval: 1000,
    })
  }

  /**
   * An override of fetch that adds the required Authorization header to every request.
   */
  public fetch(...parameters: Parameters<typeof fetch>): Promise<Response> {
    const [input, init] = parameters
    const extendedInit: RequestInit = {
      ...init,
      headers: {
        Authorization: `Basic ${btoa(`${this.provider}:${this.token}`)}`,
        ...init?.headers,
      },
    }

    return this.limiter.schedule(() => fetch(input, extendedInit))
  }

  public async get<S extends z.Schema>(path: string[], schema: S, options?: Partial<ApiSearchParams>): Promise<z.infer<S>> {
    const response = await this.fetch(
      makeApiUrl(path, this.config, {
        culture: this.config.culture,
        ...options,
      }),
    )

    if (!response.ok) {
      throw new Error(await response.json())
    }

    return schema.parseAsync(await response.json())
  }

  public async fetchCatalogs(): Promise<CatalogDefinition[]> {
    return this.get(
      ['catalogs'],
      z.array(CatalogDefinitionSchema),
    )
  }

  public async populateCache(catalogName: CatalogName, culture: ApiCulture): Promise<void>
  public async populateCache(catalogName: CatalogName, culture: ApiCulture, id: number): Promise<CatalogEntryName | null>
  public async populateCache(catalogName: CatalogName, culture: ApiCulture, id?: number): Promise<void | CatalogEntryName | null> {
    const catalog = await this.fetchCatalog(
      catalogName,
      { culture },
    )
    await this.cache.setEntries(
      catalogName,
      culture,
      catalog,
    )

    if (id !== undefined) {
      const queriedKey = catalog.find(({ id: entryId }) => entryId === id)
      return queriedKey
        ? {
            name: queriedKey.name,
            namePlural: queriedKey.name_plurial,
          }
        : null
    }
  }

  public async getCatalogEntries(catalogName: CatalogName, options?: Pick<ApiSearchParams, 'culture'>): Promise<CatalogEntry[]> {
    try {
      return await this.cache.getEntries(catalogName, options?.culture ?? this.config.culture)
    }
    catch (e) {
      if (e instanceof CacheExpiredError) {
        await this.populateCache(catalogName, options?.culture ?? this.config.culture)
        return this.cache.getEntries(catalogName, options?.culture ?? this.config.culture)
      }
      else {
        throw e
      }
    }
  }

  public async fetchCatalog(catalogName: CatalogName, options?: Pick<ApiSearchParams, 'culture'>): Promise<CatalogEntry[]> {
    return this.get(
      ['catalogs', catalogName],
      z.array(CatalogEntrySchema),
      options,
    )
  }

  public async fetchAgencies(options?: Pick<ApiSearchParams, 'culture' | 'limit' | 'offset'>) {
    return this.get(
      ['agencies'],
      z.object({
        total_items: z.number(),
        agencies: getAgencySchema(this.getLocalizedCatalogTransformer(
          options?.culture ?? this.config.culture,
        ), this.config).array(),
        timestamp: z.number(),
      },
      ),
    )
  }

  public async fetchProperties(agencyId: number, options?: Pick<ApiSearchParams, 'culture' | 'limit' | 'offset' | 'timestamp' | 'step' | 'status' | 'group'>) {
    return this.get(
      ['agencies', agencyId.toString(), 'properties'],
      z.object({
        total_items: z.number(),
        timestamp: z.number(),
        properties: getPropertySchema(this.getLocalizedCatalogTransformer(
          options?.culture ?? this.config.culture,
        )).array(),
      }),
      options,
    )
  }

  private getLocalizedCatalogTransformer(culture: ApiCulture): LocalizedCatalogTransformer {
    return async (catalogName, id) => {
      if (!this.config.catalogs.transform.active) {
        return `${catalogName}.${id}`
      }
      if (this.config.catalogs.transform.transformFn) {
        return this.config.catalogs.transform.transformFn(
          catalogName,
          culture,
          id,
        )
      }

      return this.catalogTransformer(catalogName, culture, id)
    }
  }

  private async catalogTransformer(catalogName: CatalogName, culture: ApiCulture, id: number): Promise<CatalogEntryName | null> {
    try {
      return await this.cache.getEntry(catalogName, culture, id)
    }
    catch (e) {
      if (e instanceof CacheExpiredError) {
        return await this.populateCache(catalogName, culture, id)
      }
      else {
        throw e
      }
    }
  }
}

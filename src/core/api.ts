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

export class Api {
  private readonly config: AdditionalConfig
  private readonly cache: ApiCacheAdapter
  private readonly limiter: Bottleneck

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

  public async getCatalogs(): Promise<CatalogDefinition[]> {
    const response = await this.fetch(
      makeApiUrl(['catalogs'], this.config),
    )
    return z.array(CatalogDefinitionSchema).parse(
      await response.json(),
    )
  }

  public async populateCache(catalogName: CatalogName, culture: ApiCulture): Promise<void>
  public async populateCache(catalogName: CatalogName, culture: ApiCulture, id: number): Promise<CatalogEntryName | null>
  public async populateCache(catalogName: CatalogName, culture: ApiCulture, id?: number): Promise<void | CatalogEntryName | null> {
    const catalog = await this.getCatalog(
      catalogName,
      culture,
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

  public async getCatalog(catalogName: CatalogName, culture: ApiCulture): Promise<CatalogEntry[]> {
    const response = await this.fetch(
      makeApiUrl(['catalogs', catalogName], this.config, { culture }),
    )

    if (!response.ok) {
      console.error(await response.json())
      throw new Error('Response was not OK')
    }

    return z.array(CatalogEntrySchema).parse(
      await response.json(),
    )
  }

  public async getAgencies(culture: ApiCulture, options?: Pick<ApiSearchParams, 'limit' | 'offset'>) {
    const response = await this.fetch(
      makeApiUrl(['agencies'], this.config, options),
    )

    return await z.object({
      total_items: z.number(),
      agencies: getAgencySchema(this.getLocalizedCatalogTransformer(culture), this.config).array(),
      timestamp: z.number(),
    }).parseAsync(
      await response.json(),
    )
  }

  public async getProperties(agencyId: number, culture: ApiCulture, options?: Pick<ApiSearchParams, 'limit' | 'offset' | 'timestamp' | 'step' | 'status' | 'group'>) {
    const response = await this.fetch(
      makeApiUrl(['agencies', agencyId.toString(), 'properties'], this.config, options),
    )

    if (!response.ok) {
      console.error(await response.json())
      throw new Error('Response was not OK')
    }

    return await z.object({
      total_items: z.number(),
      timestamp: z.number(),
      properties: getPropertySchema(this.getLocalizedCatalogTransformer(culture)).array(),
    }).parseAsync(
      await response.json(),
    )
  }

  private getLocalizedCatalogTransformer(culture: ApiCulture): LocalizedCatalogTransformer {
    return async (catalogName, id) => {
      if (!this.config.catalogs.transform.active) {
        return id.toString()
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

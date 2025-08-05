import type { CatalogName } from '../../consts/catalogs'
import type { ApiCulture } from '../../consts/languages'
import type { CatalogEntry } from '../../schemas/common'

export interface CatalogEntryName {
  name: string
  namePlural: string | undefined
}

export interface ApiCacheAdapter {
  setEntries: (catalogName: CatalogName, culture: ApiCulture, entries: CatalogEntry[]) => Promise<void>
  getEntry: (catalogName: CatalogName, culture: ApiCulture, id: number) => Promise<CatalogEntryName | null>
}

export class CacheExpiredError extends Error {
}

export class NotInCacheError extends Error {
}

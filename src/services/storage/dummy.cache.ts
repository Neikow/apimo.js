import type { CatalogName } from '../../consts/catalogs'
import type { ApiCulture } from '../../consts/languages'
import type { CatalogEntry } from '../../schemas/common'
import type { ApiCacheAdapter, CatalogEntryName } from './types'
import { CacheExpiredError } from './types'

export class DummyCache implements ApiCacheAdapter {
  constructor() {
  }

  async getEntries(_catalogName: CatalogName, _culture: ApiCulture): Promise<CatalogEntry[]> {
    throw new CacheExpiredError()
  }

  async setEntries(_catalogName: CatalogName, _culture: ApiCulture, _entries: CatalogEntry[]): Promise<void> {
  }

  async getEntry(_catalogName: CatalogName, _culture: ApiCulture, _id: number): Promise<CatalogEntryName | null> {
    throw new CacheExpiredError()
  }
}

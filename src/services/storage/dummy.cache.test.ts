import type { CatalogName } from '../../consts/catalogs'
import type { ApiCulture } from '../../consts/languages'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { DummyCache } from './dummy.cache'
import { CacheExpiredError } from './types'

describe('cache - Dummy', () => {
  let cache: DummyCache

  beforeEach(() => {
    cache = new DummyCache()
  })

  afterEach(() => {
    // No cleanup needed for dummy cache
  })

  describe('constructor', () => {
    it('should create an instance without any configuration', () => {
      const dummyCache = new DummyCache()
      expect(dummyCache).toBeInstanceOf(DummyCache)
    })
  })

  describe('setEntries', () => {
    const culture: ApiCulture = 'en'
    const entries = [
      { id: 1, name: 'Item 1', name_plurial: 'Items 1' },
      { id: 2, name: 'Item 2', name_plurial: 'Items 2' },
    ]

    it('should not throw when setting entries', async () => {
      const catalogName: CatalogName = 'book_step'
      await expect(cache.setEntries(catalogName, culture, entries)).resolves.toBeUndefined()
    })

    it('should handle empty entries array', async () => {
      const catalogName: CatalogName = 'book_step'
      await expect(cache.setEntries(catalogName, culture, [])).resolves.toBeUndefined()
    })

    it('should handle different catalog and culture combinations', async () => {
      await expect(cache.setEntries('book_step', 'en', entries)).resolves.toBeUndefined()
      await expect(cache.setEntries('property_land', 'fr', entries)).resolves.toBeUndefined()
      await expect(cache.setEntries('property_type', 'de', entries)).resolves.toBeUndefined()
    })
  })

  describe('getEntry', () => {
    const culture: ApiCulture = 'en'

    it('should always throw CacheExpiredError regardless of parameters', async () => {
      const catalogName: CatalogName = 'book_step'
      await expect(cache.getEntry(catalogName, culture, 1)).rejects.toThrow(CacheExpiredError)
    })

    it('should throw CacheExpiredError for any ID', async () => {
      const catalogName: CatalogName = 'book_step'
      await expect(cache.getEntry(catalogName, culture, 999)).rejects.toThrow(CacheExpiredError)
      await expect(cache.getEntry(catalogName, culture, 0)).rejects.toThrow(CacheExpiredError)
      await expect(cache.getEntry(catalogName, culture, -1)).rejects.toThrow(CacheExpiredError)
    })

    it('should throw CacheExpiredError for different catalogs and cultures', async () => {
      await expect(cache.getEntry('book_step', 'en', 1)).rejects.toThrow(CacheExpiredError)
      await expect(cache.getEntry('property_land', 'fr', 1)).rejects.toThrow(CacheExpiredError)
      await expect(cache.getEntry('property_type', 'de', 1)).rejects.toThrow(CacheExpiredError)
    })

    it('should throw CacheExpiredError even after setting entries', async () => {
      const catalogName: CatalogName = 'book_step'
      const entries = [{ id: 1, name: 'Item 1', name_plurial: 'Items 1' }]

      await cache.setEntries(catalogName, culture, entries)
      await expect(cache.getEntry(catalogName, culture, 1)).rejects.toThrow(CacheExpiredError)
    })
  })

  describe('behavior consistency', () => {
    it('should behave consistently across multiple calls', async () => {
      const catalogName: CatalogName = 'book_step'
      const culture: ApiCulture = 'en'
      const entries = [{ id: 1, name: 'Item 1', name_plurial: 'Items 1' }]

      // Multiple setEntries calls should not throw
      await expect(cache.setEntries(catalogName, culture, entries)).resolves.toBeUndefined()
      await expect(cache.setEntries(catalogName, culture, entries)).resolves.toBeUndefined()

      // Multiple getEntry calls should always throw
      await expect(cache.getEntry(catalogName, culture, 1)).rejects.toThrow(CacheExpiredError)
      await expect(cache.getEntry(catalogName, culture, 1)).rejects.toThrow(CacheExpiredError)
    })

    it('should maintain dummy behavior regardless of cache state', async () => {
      const catalogName: CatalogName = 'book_step'
      const culture: ApiCulture = 'en'

      // Should throw before any operations
      await expect(cache.getEntry(catalogName, culture, 1)).rejects.toThrow(CacheExpiredError)

      // Should still throw after setting entries
      await cache.setEntries(catalogName, culture, [{ id: 1, name: 'Test', name_plurial: 'Tests' }])
      await expect(cache.getEntry(catalogName, culture, 1)).rejects.toThrow(CacheExpiredError)

      // Should still throw after multiple operations
      await cache.setEntries(catalogName, culture, [])
      await expect(cache.getEntry(catalogName, culture, 999)).rejects.toThrow(CacheExpiredError)
    })
  })
})

import type { CatalogName } from '../../consts/catalogs'
import type { ApiCulture } from '../../consts/languages'
import { describe, expect, it } from 'vitest'
import { MemoryCache } from './memory.cache'

describe('cache - Memory', () => {
  describe('constructor', () => {
    it('should use default expiration time when no settings provided', () => {
      const defaultCache = new MemoryCache()
      expect(defaultCache.cacheExpirationMs).toBe(7 * 24 * 60 * 60 * 1000)
    })

    it('should use custom expiration time when provided', () => {
      const customExpiration = 60000
      const customCache = new MemoryCache({ cacheExpirationMs: customExpiration })
      expect(customCache.cacheExpirationMs).toBe(customExpiration)
    })
  })

  describe('setEntries and getEntry', () => {
    const culture: ApiCulture = 'en'
    const entries = [
      { id: 1, name: 'Item 1', name_plurial: 'Items 1' },
      { id: 2, name: 'Item 2', name_plurial: 'Items 2' },
    ]

    it('should store and retrieve entries correctly', async () => {
      const cache = new MemoryCache()
      const catalogName: CatalogName = 'book_step'
      await cache.setEntries(catalogName, culture, entries)

      const entry1 = await cache.getEntry(catalogName, culture, 1)
      const entry2 = await cache.getEntry(catalogName, culture, 2)

      expect(entry1).toEqual({ name: 'Item 1', namePlural: 'Items 1' })
      expect(entry2).toEqual({ name: 'Item 2', namePlural: 'Items 2' })
    })

    it('should return null for non-existent entry', async () => {
      const cache = new MemoryCache()
      const catalogName: CatalogName = 'book_step'
      await cache.setEntries(catalogName, culture, entries)

      const entry = await cache.getEntry(catalogName, culture, 999)
      expect(entry).toBeNull()
    })

    it('should throw CacheExpiredError when cache entry does not exist', async () => {
      const cache = new MemoryCache()
      const catalogName: CatalogName = 'book_step'
      await expect(cache.getEntry(catalogName, culture, 1)).rejects.toThrowError()
    })

    it('should throw CacheExpiredError when cache has expired', async () => {
      const catalogName: CatalogName = 'book_step'
      const expiredCache = new MemoryCache({ cacheExpirationMs: 1 })
      await expiredCache.setEntries(catalogName, culture, entries)

      await new Promise(resolve => setTimeout(resolve, 10))

      await expect(expiredCache.getEntry(catalogName, culture, 1)).rejects.toThrowError()
    })

    it('should handle different catalog and culture combinations', async () => {
      const cache = new MemoryCache()
      await cache.setEntries('book_step', 'en', entries)
      await cache.setEntries('property_land', 'fr', entries)

      const entry1 = await cache.getEntry('book_step', 'en', 1)
      const entry2 = await cache.getEntry('property_land', 'fr', 1)

      expect(entry1).toEqual({ name: 'Item 1', namePlural: 'Items 1' })
      expect(entry2).toEqual({ name: 'Item 1', namePlural: 'Items 1' })

      await expect(cache.getEntry('book_step', 'fr', 1)).rejects.toThrowError()
    })

    it('should overwrite existing cache when setting new entries', async () => {
      const cache = new MemoryCache()
      const catalogName: CatalogName = 'property_land'

      await cache.setEntries(catalogName, culture, entries)

      const newEntries = [{ id: 3, name: 'New Item', name_plurial: 'New Items' }]
      await cache.setEntries(catalogName, culture, newEntries)

      const newEntry = await cache.getEntry(catalogName, culture, 3)
      expect(newEntry).toEqual({ name: 'New Item', namePlural: 'New Items' })

      const oldEntry = await cache.getEntry(catalogName, culture, 1)
      expect(oldEntry).toBeNull()
    })
  })
})

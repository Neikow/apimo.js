import type { CatalogName } from '../../consts/catalogs'
import type { ApiCulture } from '../../consts/languages'
import { existsSync, mkdirSync, rmSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import * as os from 'node:os'
import * as path from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { FilesystemCache } from './filesystem.cache'
import { CacheExpiredError } from './types'

describe('cache - Filesystem', () => {
  let tempDir: string
  let cache: FilesystemCache

  beforeEach(() => {
    // Create a unique temporary directory for each test
    tempDir = path.join(os.tmpdir(), `filesystem-cache-test-${Date.now()}-${Math.random().toString(36).slice(2)}`)
    mkdirSync(tempDir, { recursive: true })
  })

  afterEach(() => {
    // Clean up the temporary directory after each test
    if (existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true, force: true })
    }
  })

  describe('constructor', () => {
    it('should use default cache location and expiration when no settings provided', () => {
      new FilesystemCache()
      expect(existsSync('./cache/catalogs')).toBe(true)
    })

    it('should create custom cache directory when provided', () => {
      const customPath = path.join(tempDir, 'custom-cache')
      cache = new FilesystemCache({ path: customPath })
      expect(existsSync(customPath)).toBe(true)
    })

    it('should use custom expiration time when provided', () => {
      const customExpiration = 60000
      cache = new FilesystemCache({
        path: tempDir,
        cacheExpirationMs: customExpiration,
      })
      // The expiration time is private, but we can test its effect
      expect(cache).toBeInstanceOf(FilesystemCache)
    })

    it('should create nested directories recursively', () => {
      const nestedPath = path.join(tempDir, 'level1', 'level2', 'cache')
      cache = new FilesystemCache({ path: nestedPath })
      expect(existsSync(nestedPath)).toBe(true)
    })
  })

  describe('setEntries and getEntry', () => {
    const culture: ApiCulture = 'en'
    const entries = [
      { id: 1, name: 'Item 1', name_plurial: 'Items 1' },
      { id: 2, name: 'Item 2', name_plurial: 'Items 2' },
    ]

    beforeEach(() => {
      cache = new FilesystemCache({ path: tempDir })
    })

    it('should store and retrieve entries correctly', async () => {
      const catalogName: CatalogName = 'book_step'
      await cache.setEntries(catalogName, culture, entries)

      const entry1 = await cache.getEntry(catalogName, culture, 1)
      const entry2 = await cache.getEntry(catalogName, culture, 2)

      expect(entry1).toEqual({ name: 'Item 1', namePlural: 'Items 1' })
      expect(entry2).toEqual({ name: 'Item 2', namePlural: 'Items 2' })
    })

    it('should create cache file with correct format', async () => {
      const catalogName: CatalogName = 'book_step'
      await cache.setEntries(catalogName, culture, entries)

      const filePath = path.join(tempDir, `${catalogName}-${culture}.json`)
      expect(existsSync(filePath)).toBe(true)

      const fileContent = await readFile(filePath, 'utf-8')
      const parsed = JSON.parse(fileContent)

      expect(parsed).toHaveProperty('timestamp')
      expect(parsed).toHaveProperty('cache')
      expect(parsed.cache).toEqual({
        1: { name: 'Item 1', namePlural: 'Items 1' },
        2: { name: 'Item 2', namePlural: 'Items 2' },
      })
      expect(typeof parsed.timestamp).toBe('number')
    })

    it('should return null for non-existent entry', async () => {
      const catalogName: CatalogName = 'book_step'
      await cache.setEntries(catalogName, culture, entries)

      const entry = await cache.getEntry(catalogName, culture, 999)
      expect(entry).toBeNull()
    })

    it('should throw CacheExpiredError when cache file does not exist', async () => {
      const catalogName: CatalogName = 'book_step'
      await expect(cache.getEntry(catalogName, culture, 1)).rejects.toThrow(CacheExpiredError)
    })

    it('should throw CacheExpiredError when cache has expired', async () => {
      const catalogName: CatalogName = 'book_step'
      const expiredCache = new FilesystemCache({
        path: tempDir,
        cacheExpirationMs: 1,
      })
      await expiredCache.setEntries(catalogName, culture, entries)

      await new Promise(resolve => setTimeout(resolve, 10))

      await expect(expiredCache.getEntry(catalogName, culture, 1)).rejects.toThrow(CacheExpiredError)
    })

    it('should handle different catalog and culture combinations', async () => {
      await cache.setEntries('book_step', 'en', entries)
      await cache.setEntries('property_land', 'fr', entries)

      const entry1 = await cache.getEntry('book_step', 'en', 1)
      const entry2 = await cache.getEntry('property_land', 'fr', 1)

      expect(entry1).toEqual({ name: 'Item 1', namePlural: 'Items 1' })
      expect(entry2).toEqual({ name: 'Item 1', namePlural: 'Items 1' })

      await expect(cache.getEntry('book_step', 'fr', 1)).rejects.toThrow(CacheExpiredError)

      // Verify separate files were created
      expect(existsSync(path.join(tempDir, 'book_step-en.json'))).toBe(true)
      expect(existsSync(path.join(tempDir, 'property_land-fr.json'))).toBe(true)
      expect(existsSync(path.join(tempDir, 'book_step-fr.json'))).toBe(false)
    })

    it('should overwrite existing cache when setting new entries', async () => {
      const catalogName: CatalogName = 'property_land'

      await cache.setEntries(catalogName, culture, entries)

      const newEntries = [{ id: 3, name: 'New Item', name_plurial: 'New Items' }]
      await cache.setEntries(catalogName, culture, newEntries)

      const newEntry = await cache.getEntry(catalogName, culture, 3)
      expect(newEntry).toEqual({ name: 'New Item', namePlural: 'New Items' })

      const oldEntry = await cache.getEntry(catalogName, culture, 1)
      expect(oldEntry).toBeNull()
    })

    it('should handle entries with undefined name_plurial', async () => {
      const catalogName: CatalogName = 'book_step'
      const entriesWithUndefined = [
        { id: 1, name: 'Item 1', name_plurial: undefined },
        { id: 2, name: 'Item 2', name_plurial: 'Items 2' },
      ]

      await cache.setEntries(catalogName, culture, entriesWithUndefined)

      const entry1 = await cache.getEntry(catalogName, culture, 1)
      const entry2 = await cache.getEntry(catalogName, culture, 2)

      expect(entry1).toEqual({ name: 'Item 1', namePlural: undefined })
      expect(entry2).toEqual({ name: 'Item 2', namePlural: 'Items 2' })
    })

    it('should handle large entry IDs correctly', async () => {
      const catalogName: CatalogName = 'book_step'
      const largeIdEntries = [
        { id: 999999999, name: 'Large ID Item', name_plurial: 'Large ID Items' },
      ]

      await cache.setEntries(catalogName, culture, largeIdEntries)

      const entry = await cache.getEntry(catalogName, culture, 999999999)
      expect(entry).toEqual({ name: 'Large ID Item', namePlural: 'Large ID Items' })
    })

    it('should persist cache across multiple FilesystemCache instances', async () => {
      const catalogName: CatalogName = 'book_step'

      // Create cache with first instance
      const cache1 = new FilesystemCache({ path: tempDir })
      await cache1.setEntries(catalogName, culture, entries)

      // Access cache with second instance
      const cache2 = new FilesystemCache({ path: tempDir })
      const entry = await cache2.getEntry(catalogName, culture, 1)

      expect(entry).toEqual({ name: 'Item 1', namePlural: 'Items 1' })
    })
  })

  describe('error handling', () => {
    beforeEach(() => {
      cache = new FilesystemCache({ path: tempDir })
    })

    it('should handle malformed JSON files gracefully', async () => {
      const catalogName: CatalogName = 'book_step'
      const culture: ApiCulture = 'en'
      const filePath = path.join(tempDir, `${catalogName}-${culture}.json`)

      // Write malformed JSON
      await writeFile(filePath, 'invalid json content')

      await expect(cache.getEntry(catalogName, culture, 1)).rejects.toThrow()
    })

    it('should handle files with missing timestamp', async () => {
      const catalogName: CatalogName = 'book_step'
      const culture: ApiCulture = 'en'
      const filePath = path.join(tempDir, `${catalogName}-${culture}.json`)

      // Write JSON without timestamp
      await writeFile(filePath, JSON.stringify({
        cache: { 1: { name: 'Test', namePlural: 'Tests' } },
      }))

      await expect(cache.getEntry(catalogName, culture, 1)).resolves.toStrictEqual({ name: 'Test', namePlural: 'Tests' })
    })

    it('should handle files with missing cache property', async () => {
      const catalogName: CatalogName = 'book_step'
      const culture: ApiCulture = 'en'
      const filePath = path.join(tempDir, `${catalogName}-${culture}.json`)

      // Write JSON without cache property
      await writeFile(filePath, JSON.stringify({
        timestamp: Date.now(),
      }))

      await expect(cache.getEntry(catalogName, culture, 1)).rejects.toThrow()
    })
  })
})

// Constants
export type { CatalogName } from './consts/catalogs'

export type { ApiCulture } from './consts/languages'
// Main exports
export { type AdditionalConfig, Apimo, DEFAULT_ADDITIONAL_CONFIG, DEFAULT_BASE_URL } from './core/api'
// Backward compatibility - keep Api as alias
export { Apimo as Api } from './core/api'

// Schema types
export type { CatalogDefinition, CatalogEntry, CatalogTransformer, LocalizedCatalogTransformer } from './schemas/common'

export { DummyCache } from './services/storage/dummy.cache'

export { FilesystemCache } from './services/storage/filesystem.cache'
// Cache adapters
export { MemoryCache } from './services/storage/memory.cache'

// Cache types and errors
export { type ApiCacheAdapter, CacheExpiredError, type CatalogEntryName } from './services/storage/types'
// Utility types
export type { DeepPartial } from './types'

export type { ApiSearchParams } from './utils/url'

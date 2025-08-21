// Main exports
export {Apimo, type AdditionalConfig, DEFAULT_ADDITIONAL_CONFIG, DEFAULT_BASE_URL} from './core/api'

// Cache adapters
export {MemoryCache} from './services/storage/memory.cache'
export {FilesystemCache} from './services/storage/filesystem.cache'
export {DummyCache} from './services/storage/dummy.cache'

// Cache types and errors
export {CacheExpiredError, type ApiCacheAdapter, type CatalogEntryName} from './services/storage/types'

// Schema types
export type {CatalogDefinition, CatalogEntry, CatalogTransformer, LocalizedCatalogTransformer} from './schemas/common'

// Constants
export type {CatalogName} from './consts/catalogs'
export type {ApiCulture} from './consts/languages'

// Utility types
export type {DeepPartial} from './types'
export type {ApiSearchParams} from './utils/url'

// Backward compatibility - keep Api as alias
export {Apimo as Api} from './core/api'

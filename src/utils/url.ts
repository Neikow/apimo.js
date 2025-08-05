import type { ApiCulture } from '../consts/languages'
import type { AdditionalConfig } from '../core/api'
import type { LACK_OF_DOCUMENTATION } from '../types'

export interface ApiSearchParams {
  culture?: ApiCulture
  limit?: number
  offset?: number
  timestamp?: number
  step?: LACK_OF_DOCUMENTATION
  status?: LACK_OF_DOCUMENTATION
  group?: LACK_OF_DOCUMENTATION

  [key: string]: string | number | undefined
}

export function makeApiUrl(pathParts: string[], config: AdditionalConfig, searchParams?: Partial<ApiSearchParams>): URL {
  const url = new URL(pathParts.join('/'), config.baseUrl)
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, value.toString())
      }
    })
  }
  return url
}

import type { CatalogName } from '../consts/catalogs'
import type { ApiCulture } from '../consts/languages'
import type { CatalogEntryName } from '../services/storage/types'
import { unknown, z } from 'zod'
import { Converters } from '../core/converters'

export interface CatalogTransformer {
  (catalogName: CatalogName, culture: ApiCulture, id: number): Promise<CatalogEntryName | string | null>
}

export interface LocalizedCatalogTransformer {
  (catalogName: CatalogName, id: number): Promise<CatalogEntryName | string | null>
}

export const CatalogDefinitionSchema = z.object({
  name: z.string(),
  path: z.string().url(),
  private: z.boolean(),
})

export type CatalogDefinition = z.infer<typeof CatalogDefinitionSchema>

export const CatalogEntrySchema = z.object({
  id: z.number(),
  culture: z.string().optional(),
  name: z.string(),
  name_plurial: z.string().optional(),
})

export type CatalogEntry = z.infer<typeof CatalogEntrySchema>

export const NameIdPairSchema = z.object({
  id: z.coerce.number(),
  name: z.string(),
})

export const CitySchema = NameIdPairSchema.extend({
  zipcode: z.string(),
})

export function getUserSchema(transformer: LocalizedCatalogTransformer) {
  return z.object({
    id: z.coerce.number(),
    agency: z.coerce.number(),
    active: z.boolean(),
    created_at: z.string().transform(Converters.toDate),
    updated_at: z.string().transform(Converters.toDate),
    firstname: z.string(),
    lastname: z.string(),
    username: z.string().optional(),
    password: z.string().optional(),
    language: z.string(),
    spoken_languages: z.string().array().optional(),
    group: z.coerce.number().transform(v => transformer('user_group', v)),
    email: z.string().email(),
    phone: z.string().nullable(),
    mobile: z.string(),
    fax: z.string().nullable(),
    city: NameIdPairSchema.nullable().optional(),
    birthday_at: z.string().transform(Converters.toDate),
    timezone: z.string().nullable(),
    picture: z.string().nullable(),
    partners: unknown().array().optional(),
    stories: unknown().array().optional(),
    rates: unknown(),
  },
  )
}

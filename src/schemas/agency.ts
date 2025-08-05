import type { AdditionalConfig } from '../core/api'
import type { LocalizedCatalogTransformer } from './common'
import { z } from 'zod'
import { Converters } from '../core/converters'
import { CitySchema, getUserSchema, NameIdPairSchema } from './common'

export function getRateSchema(transformer: LocalizedCatalogTransformer) {
  return z.object({
    id: z.coerce.number(),
    category: z.coerce.number().transform(v => transformer('property_category', v)),
    range_min: z.coerce.number().nullable(),
    range_max: z.coerce.number().nullable(),
    commission_price: z.coerce.number().nullable(),
    commission_rate: z.coerce.number().nullable(),
    comment: z.string(),
    url: z.string().nullable(),
  })
}

export const PartnerSchema = z.object({
  type: z.coerce.number(),
  partner: z.coerce.number().nullable(),
  name: z.string().nullable(),
  reference: z.string(),
  amount: z.coerce.number(),
  currency: z.string().toLowerCase(),
})

export function getAgencySchema(transformer: LocalizedCatalogTransformer, config: AdditionalConfig) {
  return z.object({
    id: z.coerce.number(),
    reference: z.coerce.number(),
    active: z.boolean(),
    name: z.string(),
    company: NameIdPairSchema,
    brand: z.unknown().nullable(),
    networks: z.unknown().array(),
    address: z.string(),
    address_more: z.string().nullable(),
    city: CitySchema,
    district: z.unknown(),
    country: z.string().toLowerCase(),
    region: z.string().toLowerCase(),
    latitude: z.coerce.number(),
    longitude: z.coerce.number(),
    email: z.string().email(),
    phone: z.string(),
    fax: z.string().nullable(),
    url: z.string(),
    logo: z.string().url(),
    logo_svg: z.string().nullable(),
    picture: z.string().url(),
    currency: z.string().toLowerCase(),
    timetable: z.string(),
    created_at: z.string().transform(Converters.toDate),
    updated_at: z.string().transform(Converters.toDate),
    providers: z.string().transform(Converters.toUrl('agencies', config.baseUrl)),
    rates: getRateSchema(transformer).array(),
    partners: PartnerSchema.array(),
    stories: z.unknown().array(),
    users: getUserSchema(transformer).array(),
    sectors: z.unknown().array(),
    parameters: z.string().transform(Converters.toUrl('agencies', config.baseUrl)),
    subscription: z.string(),
  })
}

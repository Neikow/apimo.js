import type { LocalizedCatalogTransformer } from './common'
import { z } from 'zod'
import { Converters } from '../core/converters'
import { CitySchema, getUserSchema, NameIdPairSchema } from './common'
import { TYPE_UNDOCUMENTED, TYPE_UNDOCUMENTED_NULLABLE } from './internal'

export function getAgreementSchema(transformer: LocalizedCatalogTransformer) {
  return z.object({
    type: z.coerce.number().transform(v => transformer('property_agreement', v)),
    reference: z.string(),
    start_at: z.coerce.string().transform(Converters.toDate),
    end_at: z.coerce.string().transform(Converters.toDate),
  })
}

export function getSurfaceSchema(transformer: LocalizedCatalogTransformer) {
  return z.object({
    unit: z.coerce.number().transform(v => transformer('unit_area', v)),
    value: z.coerce.number(),
    total: z.coerce.number(),
    weighted: z.coerce.number(),
  })
}

export function getPlotSchema(transformer: LocalizedCatalogTransformer) {
  return z.object({
    net_floor: z.coerce.number(),
    land_type: z.coerce.number().transform(v => transformer('property_land', v)),
    width: z.coerce.number(),
    height: z.coerce.number().optional(),
    serviced_plot: z.boolean(),
  })
}

export function getPriceSchema(transformer: LocalizedCatalogTransformer) {
  return z.object({
    value: z.coerce.number(),
    max: z.coerce.number(),
    fees: z.coerce.number(),
    unit: TYPE_UNDOCUMENTED_NULLABLE,
    period: z.coerce.number().transform(v => transformer('property_period', v)),
    hide: z.coerce.boolean(),
    inventory: z.number().nullable(),
    deposit: z.number().nullable(),
    currency: z.string().toLowerCase(),
    commission: z.number().nullable(),
    transfer_tax: TYPE_UNDOCUMENTED_NULLABLE,
    contribution: TYPE_UNDOCUMENTED_NULLABLE,
    pension: TYPE_UNDOCUMENTED_NULLABLE,
    tenant: z.number().nullable(),
    vat: z.boolean().nullable(),
  })
}

export function getResidenceSchema(transformer: LocalizedCatalogTransformer) {
  return z.object({
    id: z.coerce.number(),
    type: z.coerce.number().transform(v => transformer('property_building', v)),
    fees: z.coerce.number(),
    period: z.coerce.number().transform(v => transformer('property_period', v)),
    lots: z.coerce.number(),
  })
}

export function getViewSchema(transformer: LocalizedCatalogTransformer) {
  return z.object({
    type: z.coerce.number().transform(v => transformer('property_view_type', v)),
    landscape: z.coerce.number().transform(v => transformer('property_view_landscape', v)).array(),
  })
}

export function getConstructionSchema(transformer: LocalizedCatalogTransformer) {
  return z.object({
    type: z.coerce.number().transform(v => transformer('property_construction_method', v)).array().optional(),
    construction_year: z.coerce.number(),
    renovation_year: z.coerce.number(),
    renovation_cost: z.coerce.number(),
    construction_step: z.coerce.number().transform(v => transformer('construction_step', v)),
  })
}

export function getFloorSchema(transformer: LocalizedCatalogTransformer) {
  return z.object({
    type: z.coerce.number().transform(v => transformer('property_floor', v)),
    value: z.coerce.number(),
    levels: z.coerce.number(),
    floors: z.coerce.number(),
  })
}

export function getHeatingSchema(transformer: LocalizedCatalogTransformer) {
  return z.object({

    device: z.coerce.number().transform(v => transformer('property_heating_device', v)),
    devices: z.coerce.number().transform(v => transformer('property_heating_device', v)).array().nullable(),
    access: z.coerce.number().transform(v => transformer('property_heating_access', v)),
    type: z.coerce.number().transform(v => transformer('property_heating_type', v)),
    types: z.coerce.number().transform(v => transformer('property_heating_type', v)).array().nullable(),
  })
}

export function getWaterSchema(transformer: LocalizedCatalogTransformer) {
  return z.object({
    hot_device: z.coerce.number().transform(v => transformer('property_hot_water_device', v)),
    hot_access: z.coerce.number().transform(v => transformer('property_hot_water_access', v)),
    waste: z.coerce.number().transform(v => transformer('property_waste_water', v)),
  })
}

export const CommentSchema = z.object({
  language: z.string(),
  title: z.string().optional().nullable(),
  subtitle: z.string().optional().nullable(),
  hook: TYPE_UNDOCUMENTED_NULLABLE.optional(),
  comment: z.string(),
  comment_full: z.string().optional().nullable(),
})

export const PictureSchema = z.object({
  id: z.coerce.number(),
  rank: z.coerce.number(),
  url: z.string(),
  width_max: z.coerce.number(),
  height_max: z.coerce.number(),
  internet: z.coerce.boolean(),
  print: z.coerce.boolean(),
  panorama: z.coerce.boolean(),
  child: z.coerce.number(),
  reference: TYPE_UNDOCUMENTED_NULLABLE,
  comments: CommentSchema.array(),
})

export function getAreaSchema(transformer: LocalizedCatalogTransformer) {
  return z.object({
    type: z.coerce.number().transform(v => transformer('property_areas', v)),
    number: z.coerce.number(),
    area: z.coerce.number(),
    flooring: z.coerce.number().transform(v => transformer('property_flooring', v)),
    ceiling_height: z.number().nullable(),
    floor: z.object({
      type: z.coerce.number().transform(v => transformer('property_floor', v)),
      value: z.coerce.number(),
    }),
    orientations: z.coerce.number().transform(v => transformer('property_orientation', v)).array(),
    comments: CommentSchema.array(),
    lot: z.object({
      type: TYPE_UNDOCUMENTED_NULLABLE,
      rank: TYPE_UNDOCUMENTED_NULLABLE,
      name: TYPE_UNDOCUMENTED.array(),
    }),
  })
}

export function getRegulationSchema(transformer: LocalizedCatalogTransformer) {
  return z.object({
    type: z.coerce.number().transform(v => transformer('property_regulation', v)),
    value: z.coerce.string().transform((v) => {
      const values = v.split(',')
      return values.map(value => Number.parseInt(value))
    }),
    date: z.string().transform(Converters.toDate).nullable(),
    graph: z.string().nullable(),
  })
}

export function getPropertySchema(transformer: LocalizedCatalogTransformer) {
  return z.object(
    {
      id: z.coerce.number(),
      reference: z.number(),
      agency: z.coerce.number(),
      brand: TYPE_UNDOCUMENTED_NULLABLE,
      sector: TYPE_UNDOCUMENTED_NULLABLE,
      user: getUserSchema(transformer),
      step: z.number().transform(v => transformer('property_step', v)),
      status: z.number().transform(v => transformer('property_status', v)),
      parent: z.number().nullable(),
      ranking: TYPE_UNDOCUMENTED_NULLABLE,
      category: z.coerce.number().transform(v => transformer('property_category', v)),
      name: z.string().nullable(),
      type: z.coerce.number().transform(v => transformer('property_type', v)),
      subtype: z.coerce.number().transform(v => transformer('property_subtype', v)),
      agreement: getAgreementSchema(transformer).nullable(),
      block_name: z.string().nullable(),
      lot_reference: z.string().nullable(),
      cadastre_reference: z.string().nullable(),
      stairs_reference: z.string().nullable(),
      address: z.string().nullable(),
      address_more: z.string().nullable(),
      publish_address: z.coerce.boolean(),
      country: z.string().toLowerCase(),
      region: NameIdPairSchema,
      city: CitySchema,
      original_city: TYPE_UNDOCUMENTED_NULLABLE,
      district: NameIdPairSchema.nullable(),
      original_district: TYPE_UNDOCUMENTED_NULLABLE,
      location: TYPE_UNDOCUMENTED_NULLABLE,
      longitude: z.coerce.number(),
      latitude: z.coerce.number(),
      radius: z.coerce.number(),
      altitude: z.coerce.number(),
      referral: TYPE_UNDOCUMENTED_NULLABLE,
      subreferral: TYPE_UNDOCUMENTED_NULLABLE,
      area: getSurfaceSchema(transformer),
      plot: getPlotSchema(transformer),
      rooms: z.coerce.number(),
      bedrooms: z.coerce.number(),
      sleeps: z.coerce.number(),
      price: getPriceSchema(transformer),
      rates: z.unknown().array(),
      owner: TYPE_UNDOCUMENTED_NULLABLE,
      visit: TYPE_UNDOCUMENTED_NULLABLE,
      residence: getResidenceSchema(transformer).nullable(),
      view: getViewSchema(transformer).nullable(),
      construction: getConstructionSchema(transformer),
      floor: getFloorSchema(transformer),
      heating: getHeatingSchema(transformer),
      water: getWaterSchema(transformer),
      condition: z.coerce.number().transform(v => transformer('property_condition', v)),
      standing: z.coerce.number().transform(v => transformer('property_standing', v)),
      style: z.object({ name: z.string().nullable() }),
      twinned: z.coerce.number().nullable(),
      facades: z.coerce.number(),
      length: z.coerce.number().nullable(),
      height: z.coerce.number().nullable(),
      url: z.string().nullable(),
      availability: z.coerce.number().transform(v => transformer('property_availability', v)),
      available_at: TYPE_UNDOCUMENTED_NULLABLE,
      delivered_at: z.string().transform(Converters.toDate).nullable(),
      activities: z.coerce.number().transform(v => transformer('property_activity', v)).array(),
      orientations: z.coerce.number().transform(v => transformer('property_orientation', v)).array(),
      services: z.coerce.number().transform(v => transformer('property_service', v)).array(),
      proximities: z.coerce.number().transform(v => transformer('property_proximity', v)).array(),
      tags: z.coerce.number().transform(v => transformer('tags', v)).array(),
      tags_customized: z.unknown().array(),
      pictures: PictureSchema.array(),
      medias: z.unknown().array(),
      documents: z.unknown().array(),
      comments: CommentSchema.array(),
      areas: getAreaSchema(transformer).array(),
      regulations: getRegulationSchema(transformer).array(),
      financial: z.unknown().array(),
      exchanges: z.unknown().array(),
      options: z.unknown().array(),
      filling_rate: TYPE_UNDOCUMENTED_NULLABLE,
      private_comment: TYPE_UNDOCUMENTED_NULLABLE,
      interagency_comment: TYPE_UNDOCUMENTED_NULLABLE,
      status_comment: TYPE_UNDOCUMENTED_NULLABLE,
      logs: z.unknown().array(),
      referrals: z.unknown().array(),
      created_at: z.string().transform(Converters.toDate),
      updated_at: z.string().transform(Converters.toDate),
      created_by: z.coerce.number(),
      updated_by: z.coerce.number(),
    },
  )
}

export type ApimoProperty = z.infer<ReturnType<typeof getPropertySchema>>
export type ApimoRegulation = z.infer<ReturnType<typeof getRegulationSchema>>
export type ApimoConstruction = z.infer<ReturnType<typeof getConstructionSchema>>
export type ApimoFloor = z.infer<ReturnType<typeof getFloorSchema>>
export type ApimoHeating = z.infer<ReturnType<typeof getHeatingSchema>>
export type ApimoWater = z.infer<ReturnType<typeof getWaterSchema>>
export type ApimoPrice = z.infer<ReturnType<typeof getPriceSchema>>
export type ApimoResidence = z.infer<ReturnType<typeof getResidenceSchema>>
export type ApimoView = z.infer<ReturnType<typeof getViewSchema>>
export type ApimoAgreement = z.infer<ReturnType<typeof getAgreementSchema>>
export type ApimoSurface = z.infer<ReturnType<typeof getSurfaceSchema>>
export type ApimoPlot = z.infer<ReturnType<typeof getPlotSchema>>
export type ApimoArea = z.infer<ReturnType<typeof getAreaSchema>>
export type ApimoPicture = z.infer<typeof PictureSchema>
export type ApimoComment = z.infer<typeof CommentSchema>

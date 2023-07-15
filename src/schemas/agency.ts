import {z} from "zod";
import {CatalogTransformer, CitySchema, getUserSchema, NameIdPairSchema} from "./common";
import Apimo from "../core";

export const RateSchema = (catalogTransformer: CatalogTransformer) =>
    z.object({
        id: z.coerce.number(),
        category: z.coerce.number().transform(v => catalogTransformer('property_category', v)),
        range_min: z.coerce.number().nullable(),
        range_max: z.coerce.number().nullable(),
        commission_price: z.coerce.number().nullable(),
        commission_rate: z.coerce.number().nullable(),
        comment: z.string(),
        url: z.string().nullable(),
    });

export const getPartnerSchema = (catalogTransformer: CatalogTransformer) =>
    z.object({
        type: z.coerce.number(),
        partner: z.coerce.number().nullable(),
        name: z.string().nullable(),
        reference: z.string(),
        amount: z.coerce.number(),
        currency: z.string().toLowerCase(),
    });

export const getAgencySchema = (catalogTransformer: CatalogTransformer) =>
    z.object({
        id: z.coerce.number(),
        reference: z.coerce.number(),
        active: z.boolean(),
        name: z.string(),
        company: NameIdPairSchema,
        brand: z.unknown(),
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
        created_at: z.string().transform(v => new Date(v)),
        updated_at: z.string().transform(v => new Date(v)),
        providers: z.string().transform(v => Apimo.basePath + 'agencies' + v),
        rates: RateSchema(catalogTransformer).array(),
        partners: getPartnerSchema(catalogTransformer).array(),
        stories: z.unknown().array(),
        users: getUserSchema(catalogTransformer).array(),
        sectors: z.unknown().array(),
        parameters: z.string(),
        subscription: z.string(),
    });
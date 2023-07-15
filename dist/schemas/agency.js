"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAgencySchema = exports.getPartnerSchema = exports.RateSchema = void 0;
const zod_1 = require("zod");
const common_1 = require("./common");
const core_1 = __importDefault(require("../core"));
const RateSchema = (catalogTransformer) => zod_1.z.object({
    id: zod_1.z.coerce.number(),
    category: zod_1.z.coerce.number().transform(v => catalogTransformer('property_category', v)),
    range_min: zod_1.z.coerce.number().nullable(),
    range_max: zod_1.z.coerce.number().nullable(),
    commission_price: zod_1.z.coerce.number().nullable(),
    commission_rate: zod_1.z.coerce.number().nullable(),
    comment: zod_1.z.string(),
    url: zod_1.z.string().nullable(),
});
exports.RateSchema = RateSchema;
const getPartnerSchema = (catalogTransformer) => zod_1.z.object({
    type: zod_1.z.coerce.number(),
    partner: zod_1.z.coerce.number().nullable(),
    name: zod_1.z.string().nullable(),
    reference: zod_1.z.string(),
    amount: zod_1.z.coerce.number(),
    currency: zod_1.z.string().toLowerCase(),
});
exports.getPartnerSchema = getPartnerSchema;
const getAgencySchema = (catalogTransformer) => zod_1.z.object({
    id: zod_1.z.coerce.number(),
    reference: zod_1.z.coerce.number(),
    active: zod_1.z.boolean(),
    name: zod_1.z.string(),
    company: common_1.NameIdPairSchema,
    brand: zod_1.z.unknown(),
    networks: zod_1.z.unknown().array(),
    address: zod_1.z.string(),
    address_more: zod_1.z.string().nullable(),
    city: common_1.CitySchema,
    district: zod_1.z.unknown(),
    country: zod_1.z.string().toLowerCase(),
    region: zod_1.z.string().toLowerCase(),
    latitude: zod_1.z.coerce.number(),
    longitude: zod_1.z.coerce.number(),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string(),
    fax: zod_1.z.string().nullable(),
    url: zod_1.z.string(),
    logo: zod_1.z.string().url(),
    logo_svg: zod_1.z.string().nullable(),
    picture: zod_1.z.string().url(),
    currency: zod_1.z.string().toLowerCase(),
    timetable: zod_1.z.string(),
    created_at: zod_1.z.string().transform(v => new Date(v)),
    updated_at: zod_1.z.string().transform(v => new Date(v)),
    providers: zod_1.z.string().transform(v => core_1.default.basePath + 'agencies' + v),
    rates: (0, exports.RateSchema)(catalogTransformer).array(),
    partners: (0, exports.getPartnerSchema)(catalogTransformer).array(),
    stories: zod_1.z.unknown().array(),
    users: (0, common_1.getUserSchema)(catalogTransformer).array(),
    sectors: zod_1.z.unknown().array(),
    parameters: zod_1.z.string(),
    subscription: zod_1.z.string(),
});
exports.getAgencySchema = getAgencySchema;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPropertySchema = exports.getRegulationSchema = exports.getAreaSchema = exports.getPictureSchema = exports.getCommentSchema = exports.getWaterSchema = exports.getHeatingSchema = exports.getFloorSchema = exports.getConstructionSchema = exports.getViewSchema = exports.getResidenceSchema = exports.getPriceSchema = exports.getPlotSchema = exports.getSurfaceSchema = exports.getAgreementSchema = void 0;
const zod_1 = require("zod");
const common_1 = require("./common");
const core_1 = __importDefault(require("../core"));
const getAgreementSchema = (catalogTransformer) => zod_1.z.object({
    type: zod_1.z.coerce.number().transform(v => catalogTransformer('property_agreement', v)),
    reference: zod_1.z.string(),
    start_at: zod_1.z.coerce.string().transform(v => new Date(v)),
    end_at: zod_1.z.coerce.string().transform(v => new Date(v)),
});
exports.getAgreementSchema = getAgreementSchema;
const getSurfaceSchema = (catalogTransformer) => zod_1.z.object({
    unit: zod_1.z.coerce.number().transform(v => catalogTransformer('unit_area', v)),
    value: zod_1.z.coerce.number(),
    total: zod_1.z.coerce.number(),
    weighted: zod_1.z.coerce.number(),
});
exports.getSurfaceSchema = getSurfaceSchema;
const getPlotSchema = (catalogTransformer) => zod_1.z.object({
    net_floor: zod_1.z.coerce.number(),
    land_type: zod_1.z.unknown().transform(v => {
        if (v !== null) {
            console.log(`Unhandled key \`plot.land_type\` with value \`${v}\``);
        }
        return v;
    }),
    width: zod_1.z.coerce.number(),
    height: zod_1.z.coerce.number().optional(),
    serviced_plot: zod_1.z.boolean(),
});
exports.getPlotSchema = getPlotSchema;
const getPriceSchema = (catalogTransformer) => zod_1.z.object({
    value: zod_1.z.coerce.number(),
    max: zod_1.z.coerce.number(),
    // fees
    fees: zod_1.z.coerce.number(),
    unit: zod_1.z.unknown().transform(v => {
        if (v !== null) {
            console.log(`Unhandled key \`price.unit\` with value \`${v}\``);
        }
        return v;
    }),
    period: zod_1.z.coerce.number().transform(v => catalogTransformer('property_period', v)),
    hide: zod_1.z.coerce.boolean(),
    inventory: zod_1.z.number().nullable(),
    deposit: zod_1.z.number().nullable(),
    currency: zod_1.z.string().toLowerCase(),
    commission: zod_1.z.number().nullable(),
    transfer_tax: zod_1.z.unknown().transform(v => {
        if (v !== null) {
            console.log(`Unhandled key \`price.transfer_tax\` with value \`${v}\``);
        }
        return v;
    }),
    contribution: zod_1.z.unknown().transform(v => {
        if (v !== null) {
            console.log(`Unhandled key \`price.contribution\` with value \`${v}\``);
        }
        return v;
    }),
    pension: zod_1.z.unknown().transform(v => {
        if (v !== null) {
            console.log(`Unhandled key \`price.pension\` with value \`${v}\``);
        }
        return v;
    }),
    tenant: zod_1.z.number().nullable(),
    vat: zod_1.z.boolean().nullable(),
});
exports.getPriceSchema = getPriceSchema;
const getResidenceSchema = (catalogTransformer) => zod_1.z.object({
    id: zod_1.z.coerce.number(),
    type: zod_1.z.coerce.number().transform(v => catalogTransformer('property_building', v)),
    fees: zod_1.z.coerce.number(),
    period: zod_1.z.coerce.number().transform(v => catalogTransformer('property_period', v)),
    lots: zod_1.z.coerce.number(),
});
exports.getResidenceSchema = getResidenceSchema;
const getViewSchema = (catalogTransformer) => zod_1.z.object({
    type: zod_1.z.coerce.number().transform(v => catalogTransformer('property_view_type', v)),
    landscape: zod_1.z.coerce.number().transform(v => catalogTransformer('property_view_landscape', v)).array(),
});
exports.getViewSchema = getViewSchema;
const getConstructionSchema = (catalogTransformer) => zod_1.z.object({
    type: zod_1.z.coerce.number().transform(v => catalogTransformer('property_construction_method', v)).array().optional(),
    construction_year: zod_1.z.coerce.number(),
    renovation_year: zod_1.z.coerce.number(),
    renovation_cost: zod_1.z.coerce.number(),
    construction_step: zod_1.z.coerce.number().transform(v => catalogTransformer('construction_step', v)),
});
exports.getConstructionSchema = getConstructionSchema;
const getFloorSchema = (catalogTransformer) => zod_1.z.object({
    type: zod_1.z.coerce.number().transform(v => catalogTransformer('property_floor', v)),
    value: zod_1.z.coerce.number(),
    levels: zod_1.z.coerce.number(),
    floors: zod_1.z.coerce.number(),
});
exports.getFloorSchema = getFloorSchema;
const getHeatingSchema = (catalogTransformer) => zod_1.z.object({
    device: zod_1.z.coerce.number().transform(v => catalogTransformer('property_heating_device', v)),
    devices: zod_1.z.coerce.number().transform(v => catalogTransformer('property_heating_device', v)).array().nullable(),
    access: zod_1.z.coerce.number().transform(v => catalogTransformer('property_heating_access', v)),
    type: zod_1.z.coerce.number().transform(v => catalogTransformer('property_heating_type', v)),
    types: zod_1.z.coerce.number().transform(v => catalogTransformer('property_heating_type', v)).array().nullable(),
});
exports.getHeatingSchema = getHeatingSchema;
const getWaterSchema = (catalogTransformer) => zod_1.z.object({
    hot_device: zod_1.z.coerce.number().transform(v => catalogTransformer('property_hot_water_device', v)),
    hot_access: zod_1.z.coerce.number().transform(v => catalogTransformer('property_hot_water_access', v)),
    waste: zod_1.z.coerce.number().transform(v => catalogTransformer('property_waste_water', v)),
});
exports.getWaterSchema = getWaterSchema;
const getCommentSchema = (catalogTransformer) => zod_1.z.object({
    language: zod_1.z.string(),
    title: zod_1.z.string().optional().nullable(),
    subtitle: zod_1.z.string().optional().nullable(),
    hook: zod_1.z.unknown().transform(v => {
        if (v !== undefined) {
            console.log(`Unhandled key \`comment.hook\` with value \`${v}\``);
        }
        return v;
    }),
    comment: zod_1.z.string(),
    comment_full: zod_1.z.string().optional().nullable(),
});
exports.getCommentSchema = getCommentSchema;
const getPictureSchema = (catalogTransformer) => zod_1.z.object({
    id: zod_1.z.coerce.number(),
    rank: zod_1.z.coerce.number(),
    url: zod_1.z.string(),
    width_max: zod_1.z.coerce.number(),
    height_max: zod_1.z.coerce.number(),
    internet: zod_1.z.coerce.boolean(),
    print: zod_1.z.coerce.boolean(),
    panorama: zod_1.z.coerce.boolean(),
    child: zod_1.z.coerce.number(),
    reference: zod_1.z.unknown().transform(v => {
        if (v !== null) {
            console.log(`Unhandled key \`picture.reference\` with value \`${v}\``);
        }
        return v;
    }),
    comments: (0, exports.getCommentSchema)(catalogTransformer).array(),
});
exports.getPictureSchema = getPictureSchema;
const getAreaSchema = (catalogTransformer) => zod_1.z.object({
    type: zod_1.z.coerce.number().transform(v => catalogTransformer('property_areas', v)),
    number: zod_1.z.coerce.number(),
    area: zod_1.z.coerce.number(),
    flooring: zod_1.z.coerce.number().transform(v => catalogTransformer('property_flooring', v)),
    ceiling_height: zod_1.z.number().nullable(),
    floor: zod_1.z.object({
        type: zod_1.z.coerce.number().transform(v => catalogTransformer('property_floor', v)),
        value: zod_1.z.coerce.number(),
    }),
    orientations: zod_1.z.coerce.number().transform(v => catalogTransformer('property_orientation', v)).array(),
    comments: (0, exports.getCommentSchema)(catalogTransformer).array(),
    lot: zod_1.z.object({
        type: zod_1.z.unknown().transform(v => {
            if (v !== null) {
                console.log(`Unhandled key \`area.lot.type\` with value \`${v}\``);
            }
            return v;
        }),
        rank: zod_1.z.unknown().transform(v => {
            if (v !== null) {
                console.log(`Unhandled key \`area.lot.rank\` with value \`${v}\``);
            }
            return v;
        }),
        name: zod_1.z.unknown().array(),
    }),
});
exports.getAreaSchema = getAreaSchema;
const getRegulationSchema = (catalogTransformer) => zod_1.z.object({
    type: zod_1.z.coerce.number().transform(v => catalogTransformer('property_regulation', v)),
    value: zod_1.z.coerce.string().transform(v => {
        const values = v.split(',');
        return values.map(value => parseInt(value));
    }),
    date: zod_1.z.string().transform(core_1.default.convertDate).nullable(),
    graph: zod_1.z.string().nullable(),
});
exports.getRegulationSchema = getRegulationSchema;
const getPropertySchema = (catalogTransformer) => zod_1.z.object({
    id: zod_1.z.coerce.number(),
    reference: zod_1.z.number(),
    agency: zod_1.z.coerce.number(),
    brand: zod_1.z.unknown().transform(v => {
        if (v !== null) {
            console.log();
        }
    }),
    sector: zod_1.z.unknown().transform(v => {
        if (v !== null) {
            console.log(`Unhandled key \`property.sector\` with value \`${v}\``);
        }
    }),
    user: (0, common_1.getUserSchema)(catalogTransformer),
    step: zod_1.z.number().transform(v => catalogTransformer('property_step', v)),
    status: zod_1.z.number().transform(v => catalogTransformer('property_status', v)),
    parent: zod_1.z.number().nullable(),
    ranking: zod_1.z.unknown().transform(v => {
        if (v !== null) {
            console.log(`Unhandled key \`property.ranking\` with value \`${v}\``);
        }
    }),
    category: zod_1.z.coerce.number().transform(v => catalogTransformer('property_category', v)),
    name: zod_1.z.string().nullable(),
    type: zod_1.z.coerce.number().transform(v => catalogTransformer('property_type', v)),
    subtype: zod_1.z.coerce.number().transform(v => catalogTransformer('property_subtype', v)),
    agreement: (0, exports.getAgreementSchema)(catalogTransformer).nullable(),
    block_name: zod_1.z.string().nullable(),
    lot_reference: zod_1.z.string().nullable(),
    cadastre_reference: zod_1.z.string().nullable(),
    stairs_reference: zod_1.z.string().nullable(),
    address: zod_1.z.string().nullable(),
    address_more: zod_1.z.string().nullable(),
    publish_address: zod_1.z.coerce.boolean(),
    country: zod_1.z.string().toLowerCase(),
    region: common_1.NameIdPairSchema,
    city: common_1.CitySchema,
    original_city: zod_1.z.unknown().transform(v => {
        if (v !== null) {
            console.log(`Unhandled key \`property.original_city\` with value \`${v}\``);
        }
        return v;
    }),
    district: common_1.NameIdPairSchema.nullable(),
    original_district: zod_1.z.unknown().transform(v => {
        if (v !== null) {
            console.log(`Unhandled key \`property.original_district\` with value \`${v}\``);
        }
        return v;
    }),
    location: zod_1.z.unknown().transform(v => {
        if (v !== null) {
            console.log(`Unhandled key \`property.location\` with value \`${v}\``);
        }
        return v;
    }),
    longitude: zod_1.z.coerce.number(),
    latitude: zod_1.z.coerce.number(),
    radius: zod_1.z.coerce.number(),
    altitude: zod_1.z.coerce.number(),
    referral: zod_1.z.unknown().transform(v => {
        if (v !== null) {
            console.log(`Unhandled key \`property.referral\` with value \`${v}\``);
        }
        return v;
    }),
    subreferral: zod_1.z.unknown().transform(v => {
        if (v !== null) {
            console.log(`Unhandled key \`property.subreferral\` with value \`${v}\``);
        }
        return v;
    }),
    area: (0, exports.getSurfaceSchema)(catalogTransformer),
    plot: (0, exports.getPlotSchema)(catalogTransformer),
    rooms: zod_1.z.coerce.number(),
    bedrooms: zod_1.z.coerce.number(),
    sleeps: zod_1.z.coerce.number(),
    price: (0, exports.getPriceSchema)(catalogTransformer),
    rates: zod_1.z.unknown().array(),
    owner: zod_1.z.unknown().transform(v => {
        if (v !== null) {
            console.log(`Unhandled key \`property.owner\` with value \`${v}\``);
        }
        return v;
    }),
    visit: zod_1.z.unknown().transform(v => {
        if (v !== null) {
            console.log(`Unhandled key \`property.visit\` with value \`${v}\``);
        }
        return v;
    }),
    residence: (0, exports.getResidenceSchema)(catalogTransformer).nullable(),
    view: (0, exports.getViewSchema)(catalogTransformer).nullable(),
    construction: (0, exports.getConstructionSchema)(catalogTransformer),
    floor: (0, exports.getFloorSchema)(catalogTransformer),
    heating: (0, exports.getHeatingSchema)(catalogTransformer),
    water: (0, exports.getWaterSchema)(catalogTransformer),
    condition: zod_1.z.coerce.number().transform(v => catalogTransformer('property_condition', v)),
    standing: zod_1.z.coerce.number().transform(v => catalogTransformer('property_standing', v)),
    style: zod_1.z.object({ name: zod_1.z.string().nullable() }),
    twinned: zod_1.z.coerce.number().nullable(),
    facades: zod_1.z.unknown().transform(v => {
        if (v !== null) {
            console.log(`Unhandled key \`property.facades\` with value \`${v}\``);
        }
        return v;
    }),
    length: zod_1.z.unknown().transform(v => {
        if (v !== null) {
            console.log(`Unhandled key \`property.length\` with value \`${v}\``);
        }
        return v;
    }),
    height: zod_1.z.unknown().transform(v => {
        if (v !== null) {
            console.log(`Unhandled key \`property.height\` with value \`${v}\``);
        }
        return v;
    }),
    url: zod_1.z.string().nullable(),
    availability: zod_1.z.coerce.number().transform(v => catalogTransformer('property_availability', v)),
    available_at: zod_1.z.unknown().transform(v => {
        if (v !== null) {
            return console.log(`Unhandled key \`property.available_at\` with value \`${v}\``);
        }
        return v;
    }),
    delivered_at: zod_1.z.string().transform(core_1.default.convertDate).nullable(),
    activities: zod_1.z.coerce.number().transform(v => catalogTransformer('property_activity', v)).array(),
    orientations: zod_1.z.coerce.number().transform(v => catalogTransformer('property_orientation', v)).array(),
    services: zod_1.z.coerce.number().transform(v => catalogTransformer('property_service', v)).array(),
    proximities: zod_1.z.coerce.number().transform(v => catalogTransformer('property_proximity', v)).array(),
    tags: zod_1.z.coerce.number().transform(v => catalogTransformer('tags', v)).array(),
    tags_customized: zod_1.z.unknown().array(),
    pictures: (0, exports.getPictureSchema)(catalogTransformer).array(),
    medias: zod_1.z.unknown().array(),
    documents: zod_1.z.unknown().array(),
    comments: (0, exports.getCommentSchema)(catalogTransformer).array(),
    areas: (0, exports.getAreaSchema)(catalogTransformer).array(),
    regulations: (0, exports.getRegulationSchema)(catalogTransformer).array(),
    financial: zod_1.z.unknown().array(),
    exchanges: zod_1.z.unknown().array(),
    options: zod_1.z.unknown().array(),
    filling_rate: zod_1.z.unknown().transform(v => {
        if (v !== null) {
            console.log(`Unhandled key \`property.filling_rate\` with value \`${v}\``);
        }
        return v;
    }),
    private_comment: zod_1.z.unknown().transform(v => {
        if (v !== null) {
            console.log(`Unhandled key \`property.private_comment\` with value \`${v}\``);
        }
        return v;
    }),
    interagency_comment: zod_1.z.unknown().transform(v => {
        if (v !== null) {
            console.log(`Unhandled key \`property.interagency_comment\` with value \`${v}\``);
        }
        return v;
    }),
    status_comment: zod_1.z.unknown().transform(v => {
        if (v !== null) {
            console.log(`Unhandled key \`property.status_comment\` with value \`${v}\``);
        }
        return v;
    }),
    logs: zod_1.z.unknown().array(),
    referrals: zod_1.z.unknown().array(),
    created_at: zod_1.z.string().transform(v => new Date(v)),
    updated_at: zod_1.z.string().transform(v => new Date(v)),
    created_by: zod_1.z.coerce.number(),
    updated_by: zod_1.z.coerce.number(),
});
exports.getPropertySchema = getPropertySchema;

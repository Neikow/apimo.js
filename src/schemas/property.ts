import {z} from "zod";
import {CatalogTransformer, CitySchema, getUserSchema, NameIdPairSchema} from "./common";
import Apimo from "../core";

export const getAgreementSchema = (catalogTransformer: CatalogTransformer) =>
    z.object({
        type: z.coerce.number().transform(v => catalogTransformer('property_agreement', v)),
        reference: z.string(),
        start_at: z.coerce.string().transform(v => new Date(v)),
        end_at: z.coerce.string().transform(v => new Date(v)),
    });

export const getSurfaceSchema = (catalogTransformer: CatalogTransformer) =>
    z.object({
        unit: z.coerce.number().transform(v => catalogTransformer('unit_area', v)),
        value: z.coerce.number(),
        total: z.coerce.number(),
        weighted: z.coerce.number(),
    });

export const getPlotSchema = (catalogTransformer: CatalogTransformer) =>
    z.object({
        net_floor: z.coerce.number(),
        land_type: z.unknown().transform(v => {
            if (v !== null) {
                console.log(`Unhandled key \`plot.land_type\` with value \`${v}\``);
            }
            return v;
        }),
        width: z.coerce.number(),
        height: z.coerce.number().optional(),
        serviced_plot: z.boolean(),
    });

export const getPriceSchema = (catalogTransformer: CatalogTransformer) =>
    z.object({
        value: z.coerce.number(),
        max: z.coerce.number(),
        // fees
        fees: z.coerce.number(),
        unit: z.unknown().transform(v => {
            if (v !== null) {
                console.log(`Unhandled key \`price.unit\` with value \`${v}\``);
            }
            return v;
        }),
        period: z.coerce.number().transform(v => catalogTransformer('property_period', v)),
        hide: z.coerce.boolean(),
        inventory: z.number().nullable(),
        deposit: z.number().nullable(),
        currency: z.string().toLowerCase(),
        commission: z.number().nullable(),
        transfer_tax: z.unknown().transform(v => {
            if (v !== null) {
                console.log(`Unhandled key \`price.transfer_tax\` with value \`${v}\``);
            }
            return v;
        }),
        contribution: z.unknown().transform(v => {
            if (v !== null) {
                console.log(`Unhandled key \`price.contribution\` with value \`${v}\``);
            }
            return v;
        }),
        pension: z.unknown().transform(v => {
            if (v !== null) {
                console.log(`Unhandled key \`price.pension\` with value \`${v}\``);
            }
            return v;
        }),
        tenant: z.number().nullable(),
        vat: z.boolean().nullable(),
    });

export const getResidenceSchema = (catalogTransformer: CatalogTransformer) =>
    z.object({
        id: z.coerce.number(),
        type: z.coerce.number().transform(v => catalogTransformer('property_building', v)),
        fees: z.coerce.number(),
        period: z.coerce.number().transform(v => catalogTransformer('property_period', v)),
        lots: z.coerce.number(),
    });

export const getViewSchema = (catalogTransformer: CatalogTransformer) =>
    z.object({
        type: z.coerce.number().transform(v => catalogTransformer('property_view_type', v)),
        landscape: z.coerce.number().transform(v => catalogTransformer('property_view_landscape', v)).array(),
    });

export const getConstructionSchema = (catalogTransformer: CatalogTransformer) =>
    z.object({
        type: z.coerce.number().transform(v => catalogTransformer('property_construction_method', v)).array().optional(),
        construction_year: z.coerce.number(),
        renovation_year: z.coerce.number(),
        renovation_cost: z.coerce.number(),
        construction_step: z.coerce.number().transform(v => catalogTransformer('construction_step', v)),
    });

export const getFloorSchema = (catalogTransformer: CatalogTransformer) =>
    z.object({
        type: z.coerce.number().transform(v => catalogTransformer('property_floor', v)),
        value: z.coerce.number(),
        levels: z.coerce.number(),
        floors: z.coerce.number(),
    });

export const getHeatingSchema = (catalogTransformer: CatalogTransformer) =>
    z.object({
        device: z.coerce.number().transform(v => catalogTransformer('property_heating_device', v)),
        devices: z.coerce.number().transform(v => catalogTransformer('property_heating_device', v)).array().nullable(),
        access: z.coerce.number().transform(v => catalogTransformer('property_heating_access', v)),
        type: z.coerce.number().transform(v => catalogTransformer('property_heating_type', v)),
        types: z.coerce.number().transform(v => catalogTransformer('property_heating_type', v)).array().nullable(),
    });

export const getWaterSchema = (catalogTransformer: CatalogTransformer) =>
    z.object({
        hot_device: z.coerce.number().transform(v => catalogTransformer('property_hot_water_device', v)),
        hot_access: z.coerce.number().transform(v => catalogTransformer('property_hot_water_access', v)),
        waste: z.coerce.number().transform(v => catalogTransformer('property_waste_water', v)),
    });

export const getCommentSchema = (catalogTransformer: CatalogTransformer) =>
    z.object({
        language: z.string(),
        title: z.string().optional().nullable(),
        subtitle: z.string().optional().nullable(),
        hook: z.unknown().transform(v => {
            if (v !== null) {
                console.log(`Unhandled key \`comment.hook\` with value \`${v}\``);
            }
        }),
        comment: z.string(),
        comment_full: z.string().optional().nullable(),
    });

export const getPictureSchema = (catalogTransformer: CatalogTransformer) =>
    z.object({
        id: z.coerce.number(),
        rank: z.coerce.number(),
        url: z.string(),
        width_max: z.coerce.number(),
        height_max: z.coerce.number(),
        internet: z.coerce.boolean(),
        print: z.coerce.boolean(),
        panorama: z.coerce.boolean(),
        child: z.coerce.number(),
        reference: z.unknown().transform(v => {
            if (v !== null) {
                console.log(`Unhandled key \`picture.reference\` with value \`${v}\``);
            }
            return v;
        }),
        comments: getCommentSchema(catalogTransformer).array(),
    });

export const getAreaSchema = (catalogTransformer: CatalogTransformer) =>
    z.object({
        type: z.coerce.number().transform(v => catalogTransformer('property_areas', v)),
        number: z.coerce.number(),
        area: z.coerce.number(),
        flooring: z.coerce.number().transform(v => catalogTransformer('property_flooring', v)),
        ceiling_height: z.number().nullable(),
        floor: z.object({
            type: z.coerce.number().transform(v => catalogTransformer('property_floor', v)),
            value: z.coerce.number(),
        }),
        orientations: z.coerce.number().transform(v => catalogTransformer('property_orientation', v)).array(),
        comments: getCommentSchema(catalogTransformer).array(),
        lot: z.object({
            type: z.unknown().transform(v => {
                if (v !== null) {
                    console.log(`Unhandled key \`area.lot.type\` with value \`${v}\``);
                }
                return v;
            }),
            rank: z.unknown().transform(v => {
                if (v !== null) {
                    console.log(`Unhandled key \`area.lot.rank\` with value \`${v}\``);
                }
                return v;
            }),
            name: z.unknown().array(),
        }),
    });

export const getRegulationSchema = (catalogTransformer: CatalogTransformer) =>
    z.object({
        type: z.coerce.number().transform(v => catalogTransformer('property_regulation', v)),
        value: z.coerce.string().transform(v => {
            const values = v.split(',')
            return values.map(value => parseInt(value))
        }),
        date: z.string().transform(Apimo.convertDate).nullable(),
        graph: z.string().nullable(),
    });

export const getPropertySchema = (catalogTransformer: (key: string, value: number) => string) =>
    z.object(
        {
            id: z.coerce.number(),
            reference: z.number(),
            agency: z.coerce.number(),
            brand: z.unknown().transform(v => {
                if (v !== null) {
                    console.log()
                }
            }),
            sector: z.unknown().transform(v => {
                if (v !== null) {
                    console.log(`Unhandled key \`property.sector\` with value \`${v}\``);
                }
            }),
            user: getUserSchema(catalogTransformer),
            step: z.number().transform(v => catalogTransformer('property_step', v)),
            status: z.number().transform(v => catalogTransformer('property_status', v)),
            parent: z.number().nullable(),
            ranking: z.unknown().transform(v => {
                if (v !== null) {
                    console.log(`Unhandled key \`property.ranking\` with value \`${v}\``);
                }
            }),
            category: z.coerce.number().transform(v => catalogTransformer('property_category', v)),
            name: z.string().nullable(),
            type: z.coerce.number().transform(v => catalogTransformer('property_type', v)),
            subtype: z.coerce.number().transform(v => catalogTransformer('property_subtype', v)),
            agreement: getAgreementSchema(catalogTransformer).nullable(),
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
            original_city: z.unknown().transform(v => {
                if (v !== null) {
                    console.log(`Unhandled key \`property.original_city\` with value \`${v}\``);
                }
                return v;
            }),
            district: NameIdPairSchema.nullable(),
            original_district: z.unknown().transform(v => {
                if (v !== null) {
                    console.log(`Unhandled key \`property.original_district\` with value \`${v}\``);
                }
                return v;
            }),
            location: z.unknown().transform(v => {
                if (v !== null) {
                    console.log(`Unhandled key \`property.location\` with value \`${v}\``);
                }
                return v;
            }),
            longitude: z.coerce.number(),
            latitude: z.coerce.number(),
            radius: z.coerce.number(),
            altitude: z.coerce.number(),
            referral: z.unknown().transform(v => {
                if (v !== null) {
                    console.log(`Unhandled key \`property.referral\` with value \`${v}\``);
                }
                return v;
            }),
            subreferral: z.unknown().transform(v => {
                if (v !== null) {
                    console.log(`Unhandled key \`property.subreferral\` with value \`${v}\``);
                }
                return v;
            }),
            area: getSurfaceSchema(catalogTransformer),
            plot: getPlotSchema(catalogTransformer),
            rooms: z.coerce.number(),
            bedrooms: z.coerce.number(),
            sleeps: z.coerce.number(),
            price: getPriceSchema(catalogTransformer),
            rates: z.unknown().array(),
            owner: z.unknown().transform(v => {
                if (v !== null) {
                    console.log(`Unhandled key \`property.owner\` with value \`${v}\``);
                }
                return v;
            }),
            visit: z.unknown().transform(v => {
                if (v !== null) {
                    console.log(`Unhandled key \`property.visit\` with value \`${v}\``);
                }
                return v;
            }),
            residence: getResidenceSchema(catalogTransformer).nullable(),
            view: getViewSchema(catalogTransformer).nullable(),
            construction: getConstructionSchema(catalogTransformer),
            floor: getFloorSchema(catalogTransformer),
            heating: getHeatingSchema(catalogTransformer),
            water: getWaterSchema(catalogTransformer),
            condition: z.coerce.number().transform(v => catalogTransformer('property_condition', v)),
            standing: z.coerce.number().transform(v => catalogTransformer('property_standing', v)),
            style: z.object({name: z.string().nullable()}),
            twinned: z.coerce.number().nullable(),
            facades: z.unknown().transform(v => {
                if (v !== null) {
                    console.log(`Unhandled key \`property.facades\` with value \`${v}\``);
                }
                return v;
            }),
            length: z.unknown().transform(v => {
                if (v !== null) {
                    console.log(`Unhandled key \`property.length\` with value \`${v}\``);
                }
                return v;
            }),
            height: z.unknown().transform(v => {
                if (v !== null) {
                    console.log(`Unhandled key \`property.height\` with value \`${v}\``);
                }
                return v;
            }),
            url: z.string().nullable(),
            availability: z.coerce.number().transform(v => catalogTransformer('property_availability', v)),
            available_at: z.unknown().transform(v => {
                if (v !== null) {
                    return console.log(`Unhandled key \`property.available_at\` with value \`${v}\``);
                }
                return v;
            }),
            delivered_at: z.string().transform(Apimo.convertDate).nullable(),
            activities: z.coerce.number().transform(v => catalogTransformer('property_activity', v)).array(),
            orientations: z.coerce.number().transform(v => catalogTransformer('property_orientation', v)).array(),
            services: z.coerce.number().transform(v => catalogTransformer('property_service', v)).array(),
            proximities: z.coerce.number().transform(v => catalogTransformer('property_proximity', v)).array(),
            tags: z.coerce.number().transform(v => catalogTransformer('tags', v)).array(),
            tags_customized: z.unknown().array(),
            pictures: getPictureSchema(catalogTransformer).array(),
            medias: z.unknown().array(),
            documents: z.unknown().array(),
            comments: getCommentSchema(catalogTransformer).array(),
            areas: getAreaSchema(catalogTransformer).array(),
            regulations: getRegulationSchema(catalogTransformer).array(),
            financial: z.unknown().array(),
            exchanges: z.unknown().array(),
            options: z.unknown().array(),
            filling_rate: z.unknown().transform(v => {
                if (v !== null) {
                    console.log(`Unhandled key \`property.filling_rate\` with value \`${v}\``);
                }
                return v;
            }),
            private_comment: z.unknown().transform(v => {
                if (v !== null) {
                    console.log(`Unhandled key \`property.private_comment\` with value \`${v}\``);
                }
                return v;
            }),
            interagency_comment: z.unknown().transform(v => {
                if (v !== null) {
                    console.log(`Unhandled key \`property.interagency_comment\` with value \`${v}\``);
                }
                return v;
            }),
            status_comment: z.unknown().transform(v => {
                if (v !== null) {
                    console.log(`Unhandled key \`property.status_comment\` with value \`${v}\``);
                }
                return v;
            }),
            logs: z.unknown().array(),
            referrals: z.unknown().array(),
            created_at: z.string().transform(v => new Date(v)),
            updated_at: z.string().transform(v => new Date(v)),
            created_by: z.coerce.number(),
            updated_by: z.coerce.number(),
        });
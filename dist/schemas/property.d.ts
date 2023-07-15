import { z } from "zod";
import { CatalogTransformer } from "./common";
export declare const getAgreementSchema: (catalogTransformer: CatalogTransformer) => z.ZodObject<{
    type: z.ZodEffects<z.ZodNumber, string, number>;
    reference: z.ZodString;
    start_at: z.ZodEffects<z.ZodString, Date, string>;
    end_at: z.ZodEffects<z.ZodString, Date, string>;
}, "strip", z.ZodTypeAny, {
    type: string;
    reference: string;
    start_at: Date;
    end_at: Date;
}, {
    type: number;
    reference: string;
    start_at: string;
    end_at: string;
}>;
export declare const getSurfaceSchema: (catalogTransformer: CatalogTransformer) => z.ZodObject<{
    unit: z.ZodEffects<z.ZodNumber, string, number>;
    value: z.ZodNumber;
    total: z.ZodNumber;
    weighted: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    value: number;
    unit: string;
    total: number;
    weighted: number;
}, {
    value: number;
    unit: number;
    total: number;
    weighted: number;
}>;
export declare const getPlotSchema: (catalogTransformer: CatalogTransformer) => z.ZodObject<{
    net_floor: z.ZodNumber;
    land_type: z.ZodEffects<z.ZodUnknown, unknown, unknown>;
    width: z.ZodNumber;
    height: z.ZodOptional<z.ZodNumber>;
    serviced_plot: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    net_floor: number;
    width: number;
    serviced_plot: boolean;
    land_type?: unknown;
    height?: number | undefined;
}, {
    net_floor: number;
    width: number;
    serviced_plot: boolean;
    land_type?: unknown;
    height?: number | undefined;
}>;
export declare const getPriceSchema: (catalogTransformer: CatalogTransformer) => z.ZodObject<{
    value: z.ZodNumber;
    max: z.ZodNumber;
    fees: z.ZodNumber;
    unit: z.ZodEffects<z.ZodUnknown, unknown, unknown>;
    period: z.ZodEffects<z.ZodNumber, string, number>;
    hide: z.ZodBoolean;
    inventory: z.ZodNullable<z.ZodNumber>;
    deposit: z.ZodNullable<z.ZodNumber>;
    currency: z.ZodString;
    commission: z.ZodNullable<z.ZodNumber>;
    transfer_tax: z.ZodEffects<z.ZodUnknown, unknown, unknown>;
    contribution: z.ZodEffects<z.ZodUnknown, unknown, unknown>;
    pension: z.ZodEffects<z.ZodUnknown, unknown, unknown>;
    tenant: z.ZodNullable<z.ZodNumber>;
    vat: z.ZodNullable<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    value: number;
    max: number;
    fees: number;
    period: string;
    hide: boolean;
    inventory: number | null;
    deposit: number | null;
    currency: string;
    commission: number | null;
    tenant: number | null;
    vat: boolean | null;
    unit?: unknown;
    transfer_tax?: unknown;
    contribution?: unknown;
    pension?: unknown;
}, {
    value: number;
    max: number;
    fees: number;
    period: number;
    hide: boolean;
    inventory: number | null;
    deposit: number | null;
    currency: string;
    commission: number | null;
    tenant: number | null;
    vat: boolean | null;
    unit?: unknown;
    transfer_tax?: unknown;
    contribution?: unknown;
    pension?: unknown;
}>;
export declare const getResidenceSchema: (catalogTransformer: CatalogTransformer) => z.ZodObject<{
    id: z.ZodNumber;
    type: z.ZodEffects<z.ZodNumber, string, number>;
    fees: z.ZodNumber;
    period: z.ZodEffects<z.ZodNumber, string, number>;
    lots: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: number;
    type: string;
    fees: number;
    period: string;
    lots: number;
}, {
    id: number;
    type: number;
    fees: number;
    period: number;
    lots: number;
}>;
export declare const getViewSchema: (catalogTransformer: CatalogTransformer) => z.ZodObject<{
    type: z.ZodEffects<z.ZodNumber, string, number>;
    landscape: z.ZodArray<z.ZodEffects<z.ZodNumber, string, number>, "many">;
}, "strip", z.ZodTypeAny, {
    type: string;
    landscape: string[];
}, {
    type: number;
    landscape: number[];
}>;
export declare const getConstructionSchema: (catalogTransformer: CatalogTransformer) => z.ZodObject<{
    type: z.ZodOptional<z.ZodArray<z.ZodEffects<z.ZodNumber, string, number>, "many">>;
    construction_year: z.ZodNumber;
    renovation_year: z.ZodNumber;
    renovation_cost: z.ZodNumber;
    construction_step: z.ZodEffects<z.ZodNumber, string, number>;
}, "strip", z.ZodTypeAny, {
    construction_year: number;
    renovation_year: number;
    renovation_cost: number;
    construction_step: string;
    type?: string[] | undefined;
}, {
    construction_year: number;
    renovation_year: number;
    renovation_cost: number;
    construction_step: number;
    type?: number[] | undefined;
}>;
export declare const getFloorSchema: (catalogTransformer: CatalogTransformer) => z.ZodObject<{
    type: z.ZodEffects<z.ZodNumber, string, number>;
    value: z.ZodNumber;
    levels: z.ZodNumber;
    floors: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type: string;
    value: number;
    levels: number;
    floors: number;
}, {
    type: number;
    value: number;
    levels: number;
    floors: number;
}>;
export declare const getHeatingSchema: (catalogTransformer: CatalogTransformer) => z.ZodObject<{
    device: z.ZodEffects<z.ZodNumber, string, number>;
    devices: z.ZodNullable<z.ZodArray<z.ZodEffects<z.ZodNumber, string, number>, "many">>;
    access: z.ZodEffects<z.ZodNumber, string, number>;
    type: z.ZodEffects<z.ZodNumber, string, number>;
    types: z.ZodNullable<z.ZodArray<z.ZodEffects<z.ZodNumber, string, number>, "many">>;
}, "strip", z.ZodTypeAny, {
    type: string;
    device: string;
    devices: string[] | null;
    access: string;
    types: string[] | null;
}, {
    type: number;
    device: number;
    devices: number[] | null;
    access: number;
    types: number[] | null;
}>;
export declare const getWaterSchema: (catalogTransformer: CatalogTransformer) => z.ZodObject<{
    hot_device: z.ZodEffects<z.ZodNumber, string, number>;
    hot_access: z.ZodEffects<z.ZodNumber, string, number>;
    waste: z.ZodEffects<z.ZodNumber, string, number>;
}, "strip", z.ZodTypeAny, {
    hot_device: string;
    hot_access: string;
    waste: string;
}, {
    hot_device: number;
    hot_access: number;
    waste: number;
}>;
export declare const getCommentSchema: (catalogTransformer: CatalogTransformer) => z.ZodObject<{
    language: z.ZodString;
    title: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    subtitle: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    hook: z.ZodEffects<z.ZodUnknown, void, unknown>;
    comment: z.ZodString;
    comment_full: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    language: string;
    comment: string;
    title?: string | null | undefined;
    subtitle?: string | null | undefined;
    hook?: void | undefined;
    comment_full?: string | null | undefined;
}, {
    language: string;
    comment: string;
    title?: string | null | undefined;
    subtitle?: string | null | undefined;
    hook?: unknown;
    comment_full?: string | null | undefined;
}>;
export declare const getPictureSchema: (catalogTransformer: CatalogTransformer) => z.ZodObject<{
    id: z.ZodNumber;
    rank: z.ZodNumber;
    url: z.ZodString;
    width_max: z.ZodNumber;
    height_max: z.ZodNumber;
    internet: z.ZodBoolean;
    print: z.ZodBoolean;
    panorama: z.ZodBoolean;
    child: z.ZodNumber;
    reference: z.ZodEffects<z.ZodUnknown, unknown, unknown>;
    comments: z.ZodArray<z.ZodObject<{
        language: z.ZodString;
        title: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        subtitle: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        hook: z.ZodEffects<z.ZodUnknown, void, unknown>;
        comment: z.ZodString;
        comment_full: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        language: string;
        comment: string;
        title?: string | null | undefined;
        subtitle?: string | null | undefined;
        hook?: void | undefined;
        comment_full?: string | null | undefined;
    }, {
        language: string;
        comment: string;
        title?: string | null | undefined;
        subtitle?: string | null | undefined;
        hook?: unknown;
        comment_full?: string | null | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    id: number;
    rank: number;
    url: string;
    width_max: number;
    height_max: number;
    internet: boolean;
    print: boolean;
    panorama: boolean;
    child: number;
    comments: {
        language: string;
        comment: string;
        title?: string | null | undefined;
        subtitle?: string | null | undefined;
        hook?: void | undefined;
        comment_full?: string | null | undefined;
    }[];
    reference?: unknown;
}, {
    id: number;
    rank: number;
    url: string;
    width_max: number;
    height_max: number;
    internet: boolean;
    print: boolean;
    panorama: boolean;
    child: number;
    comments: {
        language: string;
        comment: string;
        title?: string | null | undefined;
        subtitle?: string | null | undefined;
        hook?: unknown;
        comment_full?: string | null | undefined;
    }[];
    reference?: unknown;
}>;
export declare const getAreaSchema: (catalogTransformer: CatalogTransformer) => z.ZodObject<{
    type: z.ZodEffects<z.ZodNumber, string, number>;
    number: z.ZodNumber;
    area: z.ZodNumber;
    flooring: z.ZodEffects<z.ZodNumber, string, number>;
    ceiling_height: z.ZodNullable<z.ZodNumber>;
    floor: z.ZodObject<{
        type: z.ZodEffects<z.ZodNumber, string, number>;
        value: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        type: string;
        value: number;
    }, {
        type: number;
        value: number;
    }>;
    orientations: z.ZodArray<z.ZodEffects<z.ZodNumber, string, number>, "many">;
    comments: z.ZodArray<z.ZodObject<{
        language: z.ZodString;
        title: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        subtitle: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        hook: z.ZodEffects<z.ZodUnknown, void, unknown>;
        comment: z.ZodString;
        comment_full: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        language: string;
        comment: string;
        title?: string | null | undefined;
        subtitle?: string | null | undefined;
        hook?: void | undefined;
        comment_full?: string | null | undefined;
    }, {
        language: string;
        comment: string;
        title?: string | null | undefined;
        subtitle?: string | null | undefined;
        hook?: unknown;
        comment_full?: string | null | undefined;
    }>, "many">;
    lot: z.ZodObject<{
        type: z.ZodEffects<z.ZodUnknown, unknown, unknown>;
        rank: z.ZodEffects<z.ZodUnknown, unknown, unknown>;
        name: z.ZodArray<z.ZodUnknown, "many">;
    }, "strip", z.ZodTypeAny, {
        name: unknown[];
        type?: unknown;
        rank?: unknown;
    }, {
        name: unknown[];
        type?: unknown;
        rank?: unknown;
    }>;
}, "strip", z.ZodTypeAny, {
    number: number;
    type: string;
    comments: {
        language: string;
        comment: string;
        title?: string | null | undefined;
        subtitle?: string | null | undefined;
        hook?: void | undefined;
        comment_full?: string | null | undefined;
    }[];
    area: number;
    flooring: string;
    ceiling_height: number | null;
    floor: {
        type: string;
        value: number;
    };
    orientations: string[];
    lot: {
        name: unknown[];
        type?: unknown;
        rank?: unknown;
    };
}, {
    number: number;
    type: number;
    comments: {
        language: string;
        comment: string;
        title?: string | null | undefined;
        subtitle?: string | null | undefined;
        hook?: unknown;
        comment_full?: string | null | undefined;
    }[];
    area: number;
    flooring: number;
    ceiling_height: number | null;
    floor: {
        type: number;
        value: number;
    };
    orientations: number[];
    lot: {
        name: unknown[];
        type?: unknown;
        rank?: unknown;
    };
}>;
export declare const getRegulationSchema: (catalogTransformer: CatalogTransformer) => z.ZodObject<{
    type: z.ZodEffects<z.ZodNumber, string, number>;
    value: z.ZodEffects<z.ZodString, number[], string>;
    date: z.ZodNullable<z.ZodEffects<z.ZodString, Date, string>>;
    graph: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: string;
    value: number[];
    date: Date | null;
    graph: string | null;
}, {
    type: number;
    value: string;
    date: string | null;
    graph: string | null;
}>;
export declare const getPropertySchema: (catalogTransformer: (key: string, value: number) => string) => z.ZodObject<{
    id: z.ZodNumber;
    reference: z.ZodNumber;
    agency: z.ZodNumber;
    brand: z.ZodEffects<z.ZodUnknown, void, unknown>;
    sector: z.ZodEffects<z.ZodUnknown, void, unknown>;
    user: z.ZodObject<{
        id: z.ZodNumber;
        agency: z.ZodNumber;
        active: z.ZodBoolean;
        created_at: z.ZodEffects<z.ZodString, Date, string>;
        updated_at: z.ZodEffects<z.ZodString, Date, string>;
        firstname: z.ZodString;
        lastname: z.ZodString;
        username: z.ZodOptional<z.ZodString>;
        password: z.ZodOptional<z.ZodString>;
        language: z.ZodString;
        spoken_languages: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        group: z.ZodEffects<z.ZodNumber, string, number>;
        email: z.ZodString;
        phone: z.ZodNullable<z.ZodString>;
        mobile: z.ZodString;
        fax: z.ZodNullable<z.ZodString>;
        city: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            id: z.ZodNumber;
            name: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: number;
            name: string;
        }, {
            id: number;
            name: string;
        }>>>;
        birthday_at: z.ZodEffects<z.ZodString, Date, string>;
        timezone: z.ZodNullable<z.ZodString>;
        picture: z.ZodNullable<z.ZodString>;
        partners: z.ZodOptional<z.ZodArray<z.ZodUnknown, "many">>;
        stories: z.ZodOptional<z.ZodArray<z.ZodUnknown, "many">>;
        rates: z.ZodUnknown;
    }, "strip", z.ZodTypeAny, {
        id: number;
        agency: number;
        active: boolean;
        created_at: Date;
        updated_at: Date;
        firstname: string;
        lastname: string;
        language: string;
        group: string;
        email: string;
        phone: string | null;
        mobile: string;
        fax: string | null;
        birthday_at: Date;
        timezone: string | null;
        picture: string | null;
        username?: string | undefined;
        password?: string | undefined;
        spoken_languages?: string[] | undefined;
        city?: {
            id: number;
            name: string;
        } | null | undefined;
        partners?: unknown[] | undefined;
        stories?: unknown[] | undefined;
        rates?: unknown;
    }, {
        id: number;
        agency: number;
        active: boolean;
        created_at: string;
        updated_at: string;
        firstname: string;
        lastname: string;
        language: string;
        group: number;
        email: string;
        phone: string | null;
        mobile: string;
        fax: string | null;
        birthday_at: string;
        timezone: string | null;
        picture: string | null;
        username?: string | undefined;
        password?: string | undefined;
        spoken_languages?: string[] | undefined;
        city?: {
            id: number;
            name: string;
        } | null | undefined;
        partners?: unknown[] | undefined;
        stories?: unknown[] | undefined;
        rates?: unknown;
    }>;
    step: z.ZodEffects<z.ZodNumber, string, number>;
    status: z.ZodEffects<z.ZodNumber, string, number>;
    parent: z.ZodNullable<z.ZodNumber>;
    ranking: z.ZodEffects<z.ZodUnknown, void, unknown>;
    category: z.ZodEffects<z.ZodNumber, string, number>;
    name: z.ZodNullable<z.ZodString>;
    type: z.ZodEffects<z.ZodNumber, string, number>;
    subtype: z.ZodEffects<z.ZodNumber, string, number>;
    agreement: z.ZodNullable<z.ZodObject<{
        type: z.ZodEffects<z.ZodNumber, string, number>;
        reference: z.ZodString;
        start_at: z.ZodEffects<z.ZodString, Date, string>;
        end_at: z.ZodEffects<z.ZodString, Date, string>;
    }, "strip", z.ZodTypeAny, {
        type: string;
        reference: string;
        start_at: Date;
        end_at: Date;
    }, {
        type: number;
        reference: string;
        start_at: string;
        end_at: string;
    }>>;
    block_name: z.ZodNullable<z.ZodString>;
    lot_reference: z.ZodNullable<z.ZodString>;
    cadastre_reference: z.ZodNullable<z.ZodString>;
    stairs_reference: z.ZodNullable<z.ZodString>;
    address: z.ZodNullable<z.ZodString>;
    address_more: z.ZodNullable<z.ZodString>;
    publish_address: z.ZodBoolean;
    country: z.ZodString;
    region: z.ZodObject<{
        id: z.ZodNumber;
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: number;
        name: string;
    }, {
        id: number;
        name: string;
    }>;
    city: z.ZodObject<{
        id: z.ZodNumber;
        name: z.ZodString;
        zipcode: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: number;
        name: string;
        zipcode: string;
    }, {
        id: number;
        name: string;
        zipcode: string;
    }>;
    original_city: z.ZodEffects<z.ZodUnknown, unknown, unknown>;
    district: z.ZodNullable<z.ZodObject<{
        id: z.ZodNumber;
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: number;
        name: string;
    }, {
        id: number;
        name: string;
    }>>;
    original_district: z.ZodEffects<z.ZodUnknown, unknown, unknown>;
    location: z.ZodEffects<z.ZodUnknown, unknown, unknown>;
    longitude: z.ZodNumber;
    latitude: z.ZodNumber;
    radius: z.ZodNumber;
    altitude: z.ZodNumber;
    referral: z.ZodEffects<z.ZodUnknown, unknown, unknown>;
    subreferral: z.ZodEffects<z.ZodUnknown, unknown, unknown>;
    area: z.ZodObject<{
        unit: z.ZodEffects<z.ZodNumber, string, number>;
        value: z.ZodNumber;
        total: z.ZodNumber;
        weighted: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        value: number;
        unit: string;
        total: number;
        weighted: number;
    }, {
        value: number;
        unit: number;
        total: number;
        weighted: number;
    }>;
    plot: z.ZodObject<{
        net_floor: z.ZodNumber;
        land_type: z.ZodEffects<z.ZodUnknown, unknown, unknown>;
        width: z.ZodNumber;
        height: z.ZodOptional<z.ZodNumber>;
        serviced_plot: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        net_floor: number;
        width: number;
        serviced_plot: boolean;
        land_type?: unknown;
        height?: number | undefined;
    }, {
        net_floor: number;
        width: number;
        serviced_plot: boolean;
        land_type?: unknown;
        height?: number | undefined;
    }>;
    rooms: z.ZodNumber;
    bedrooms: z.ZodNumber;
    sleeps: z.ZodNumber;
    price: z.ZodObject<{
        value: z.ZodNumber;
        max: z.ZodNumber;
        fees: z.ZodNumber;
        unit: z.ZodEffects<z.ZodUnknown, unknown, unknown>;
        period: z.ZodEffects<z.ZodNumber, string, number>;
        hide: z.ZodBoolean;
        inventory: z.ZodNullable<z.ZodNumber>;
        deposit: z.ZodNullable<z.ZodNumber>;
        currency: z.ZodString;
        commission: z.ZodNullable<z.ZodNumber>;
        transfer_tax: z.ZodEffects<z.ZodUnknown, unknown, unknown>;
        contribution: z.ZodEffects<z.ZodUnknown, unknown, unknown>;
        pension: z.ZodEffects<z.ZodUnknown, unknown, unknown>;
        tenant: z.ZodNullable<z.ZodNumber>;
        vat: z.ZodNullable<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        value: number;
        max: number;
        fees: number;
        period: string;
        hide: boolean;
        inventory: number | null;
        deposit: number | null;
        currency: string;
        commission: number | null;
        tenant: number | null;
        vat: boolean | null;
        unit?: unknown;
        transfer_tax?: unknown;
        contribution?: unknown;
        pension?: unknown;
    }, {
        value: number;
        max: number;
        fees: number;
        period: number;
        hide: boolean;
        inventory: number | null;
        deposit: number | null;
        currency: string;
        commission: number | null;
        tenant: number | null;
        vat: boolean | null;
        unit?: unknown;
        transfer_tax?: unknown;
        contribution?: unknown;
        pension?: unknown;
    }>;
    rates: z.ZodArray<z.ZodUnknown, "many">;
    owner: z.ZodEffects<z.ZodUnknown, unknown, unknown>;
    visit: z.ZodEffects<z.ZodUnknown, unknown, unknown>;
    residence: z.ZodNullable<z.ZodObject<{
        id: z.ZodNumber;
        type: z.ZodEffects<z.ZodNumber, string, number>;
        fees: z.ZodNumber;
        period: z.ZodEffects<z.ZodNumber, string, number>;
        lots: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        id: number;
        type: string;
        fees: number;
        period: string;
        lots: number;
    }, {
        id: number;
        type: number;
        fees: number;
        period: number;
        lots: number;
    }>>;
    view: z.ZodNullable<z.ZodObject<{
        type: z.ZodEffects<z.ZodNumber, string, number>;
        landscape: z.ZodArray<z.ZodEffects<z.ZodNumber, string, number>, "many">;
    }, "strip", z.ZodTypeAny, {
        type: string;
        landscape: string[];
    }, {
        type: number;
        landscape: number[];
    }>>;
    construction: z.ZodObject<{
        type: z.ZodOptional<z.ZodArray<z.ZodEffects<z.ZodNumber, string, number>, "many">>;
        construction_year: z.ZodNumber;
        renovation_year: z.ZodNumber;
        renovation_cost: z.ZodNumber;
        construction_step: z.ZodEffects<z.ZodNumber, string, number>;
    }, "strip", z.ZodTypeAny, {
        construction_year: number;
        renovation_year: number;
        renovation_cost: number;
        construction_step: string;
        type?: string[] | undefined;
    }, {
        construction_year: number;
        renovation_year: number;
        renovation_cost: number;
        construction_step: number;
        type?: number[] | undefined;
    }>;
    floor: z.ZodObject<{
        type: z.ZodEffects<z.ZodNumber, string, number>;
        value: z.ZodNumber;
        levels: z.ZodNumber;
        floors: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        type: string;
        value: number;
        levels: number;
        floors: number;
    }, {
        type: number;
        value: number;
        levels: number;
        floors: number;
    }>;
    heating: z.ZodObject<{
        device: z.ZodEffects<z.ZodNumber, string, number>;
        devices: z.ZodNullable<z.ZodArray<z.ZodEffects<z.ZodNumber, string, number>, "many">>;
        access: z.ZodEffects<z.ZodNumber, string, number>;
        type: z.ZodEffects<z.ZodNumber, string, number>;
        types: z.ZodNullable<z.ZodArray<z.ZodEffects<z.ZodNumber, string, number>, "many">>;
    }, "strip", z.ZodTypeAny, {
        type: string;
        device: string;
        devices: string[] | null;
        access: string;
        types: string[] | null;
    }, {
        type: number;
        device: number;
        devices: number[] | null;
        access: number;
        types: number[] | null;
    }>;
    water: z.ZodObject<{
        hot_device: z.ZodEffects<z.ZodNumber, string, number>;
        hot_access: z.ZodEffects<z.ZodNumber, string, number>;
        waste: z.ZodEffects<z.ZodNumber, string, number>;
    }, "strip", z.ZodTypeAny, {
        hot_device: string;
        hot_access: string;
        waste: string;
    }, {
        hot_device: number;
        hot_access: number;
        waste: number;
    }>;
    condition: z.ZodEffects<z.ZodNumber, string, number>;
    standing: z.ZodEffects<z.ZodNumber, string, number>;
    style: z.ZodObject<{
        name: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string | null;
    }, {
        name: string | null;
    }>;
    twinned: z.ZodNullable<z.ZodNumber>;
    facades: z.ZodEffects<z.ZodUnknown, unknown, unknown>;
    length: z.ZodEffects<z.ZodUnknown, unknown, unknown>;
    height: z.ZodEffects<z.ZodUnknown, unknown, unknown>;
    url: z.ZodNullable<z.ZodString>;
    availability: z.ZodEffects<z.ZodNumber, string, number>;
    available_at: z.ZodEffects<z.ZodUnknown, void | null, unknown>;
    delivered_at: z.ZodNullable<z.ZodEffects<z.ZodString, Date, string>>;
    activities: z.ZodArray<z.ZodEffects<z.ZodNumber, string, number>, "many">;
    orientations: z.ZodArray<z.ZodEffects<z.ZodNumber, string, number>, "many">;
    services: z.ZodArray<z.ZodEffects<z.ZodNumber, string, number>, "many">;
    proximities: z.ZodArray<z.ZodEffects<z.ZodNumber, string, number>, "many">;
    tags: z.ZodArray<z.ZodEffects<z.ZodNumber, string, number>, "many">;
    tags_customized: z.ZodArray<z.ZodUnknown, "many">;
    pictures: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        rank: z.ZodNumber;
        url: z.ZodString;
        width_max: z.ZodNumber;
        height_max: z.ZodNumber;
        internet: z.ZodBoolean;
        print: z.ZodBoolean;
        panorama: z.ZodBoolean;
        child: z.ZodNumber;
        reference: z.ZodEffects<z.ZodUnknown, unknown, unknown>;
        comments: z.ZodArray<z.ZodObject<{
            language: z.ZodString;
            title: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            subtitle: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            hook: z.ZodEffects<z.ZodUnknown, void, unknown>;
            comment: z.ZodString;
            comment_full: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            language: string;
            comment: string;
            title?: string | null | undefined;
            subtitle?: string | null | undefined;
            hook?: void | undefined;
            comment_full?: string | null | undefined;
        }, {
            language: string;
            comment: string;
            title?: string | null | undefined;
            subtitle?: string | null | undefined;
            hook?: unknown;
            comment_full?: string | null | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        id: number;
        rank: number;
        url: string;
        width_max: number;
        height_max: number;
        internet: boolean;
        print: boolean;
        panorama: boolean;
        child: number;
        comments: {
            language: string;
            comment: string;
            title?: string | null | undefined;
            subtitle?: string | null | undefined;
            hook?: void | undefined;
            comment_full?: string | null | undefined;
        }[];
        reference?: unknown;
    }, {
        id: number;
        rank: number;
        url: string;
        width_max: number;
        height_max: number;
        internet: boolean;
        print: boolean;
        panorama: boolean;
        child: number;
        comments: {
            language: string;
            comment: string;
            title?: string | null | undefined;
            subtitle?: string | null | undefined;
            hook?: unknown;
            comment_full?: string | null | undefined;
        }[];
        reference?: unknown;
    }>, "many">;
    medias: z.ZodArray<z.ZodUnknown, "many">;
    documents: z.ZodArray<z.ZodUnknown, "many">;
    comments: z.ZodArray<z.ZodObject<{
        language: z.ZodString;
        title: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        subtitle: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        hook: z.ZodEffects<z.ZodUnknown, void, unknown>;
        comment: z.ZodString;
        comment_full: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        language: string;
        comment: string;
        title?: string | null | undefined;
        subtitle?: string | null | undefined;
        hook?: void | undefined;
        comment_full?: string | null | undefined;
    }, {
        language: string;
        comment: string;
        title?: string | null | undefined;
        subtitle?: string | null | undefined;
        hook?: unknown;
        comment_full?: string | null | undefined;
    }>, "many">;
    areas: z.ZodArray<z.ZodObject<{
        type: z.ZodEffects<z.ZodNumber, string, number>;
        number: z.ZodNumber;
        area: z.ZodNumber;
        flooring: z.ZodEffects<z.ZodNumber, string, number>;
        ceiling_height: z.ZodNullable<z.ZodNumber>;
        floor: z.ZodObject<{
            type: z.ZodEffects<z.ZodNumber, string, number>;
            value: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            type: string;
            value: number;
        }, {
            type: number;
            value: number;
        }>;
        orientations: z.ZodArray<z.ZodEffects<z.ZodNumber, string, number>, "many">;
        comments: z.ZodArray<z.ZodObject<{
            language: z.ZodString;
            title: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            subtitle: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            hook: z.ZodEffects<z.ZodUnknown, void, unknown>;
            comment: z.ZodString;
            comment_full: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            language: string;
            comment: string;
            title?: string | null | undefined;
            subtitle?: string | null | undefined;
            hook?: void | undefined;
            comment_full?: string | null | undefined;
        }, {
            language: string;
            comment: string;
            title?: string | null | undefined;
            subtitle?: string | null | undefined;
            hook?: unknown;
            comment_full?: string | null | undefined;
        }>, "many">;
        lot: z.ZodObject<{
            type: z.ZodEffects<z.ZodUnknown, unknown, unknown>;
            rank: z.ZodEffects<z.ZodUnknown, unknown, unknown>;
            name: z.ZodArray<z.ZodUnknown, "many">;
        }, "strip", z.ZodTypeAny, {
            name: unknown[];
            type?: unknown;
            rank?: unknown;
        }, {
            name: unknown[];
            type?: unknown;
            rank?: unknown;
        }>;
    }, "strip", z.ZodTypeAny, {
        number: number;
        type: string;
        comments: {
            language: string;
            comment: string;
            title?: string | null | undefined;
            subtitle?: string | null | undefined;
            hook?: void | undefined;
            comment_full?: string | null | undefined;
        }[];
        area: number;
        flooring: string;
        ceiling_height: number | null;
        floor: {
            type: string;
            value: number;
        };
        orientations: string[];
        lot: {
            name: unknown[];
            type?: unknown;
            rank?: unknown;
        };
    }, {
        number: number;
        type: number;
        comments: {
            language: string;
            comment: string;
            title?: string | null | undefined;
            subtitle?: string | null | undefined;
            hook?: unknown;
            comment_full?: string | null | undefined;
        }[];
        area: number;
        flooring: number;
        ceiling_height: number | null;
        floor: {
            type: number;
            value: number;
        };
        orientations: number[];
        lot: {
            name: unknown[];
            type?: unknown;
            rank?: unknown;
        };
    }>, "many">;
    regulations: z.ZodArray<z.ZodObject<{
        type: z.ZodEffects<z.ZodNumber, string, number>;
        value: z.ZodEffects<z.ZodString, number[], string>;
        date: z.ZodNullable<z.ZodEffects<z.ZodString, Date, string>>;
        graph: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: string;
        value: number[];
        date: Date | null;
        graph: string | null;
    }, {
        type: number;
        value: string;
        date: string | null;
        graph: string | null;
    }>, "many">;
    financial: z.ZodArray<z.ZodUnknown, "many">;
    exchanges: z.ZodArray<z.ZodUnknown, "many">;
    options: z.ZodArray<z.ZodUnknown, "many">;
    filling_rate: z.ZodEffects<z.ZodUnknown, unknown, unknown>;
    private_comment: z.ZodEffects<z.ZodUnknown, unknown, unknown>;
    interagency_comment: z.ZodEffects<z.ZodUnknown, unknown, unknown>;
    status_comment: z.ZodEffects<z.ZodUnknown, unknown, unknown>;
    logs: z.ZodArray<z.ZodUnknown, "many">;
    referrals: z.ZodArray<z.ZodUnknown, "many">;
    created_at: z.ZodEffects<z.ZodString, Date, string>;
    updated_at: z.ZodEffects<z.ZodString, Date, string>;
    created_by: z.ZodNumber;
    updated_by: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: number;
    name: string | null;
    options: unknown[];
    type: string;
    status: string;
    agency: number;
    created_at: Date;
    updated_at: Date;
    city: {
        id: number;
        name: string;
        zipcode: string;
    };
    rates: unknown[];
    reference: number;
    url: string | null;
    comments: {
        language: string;
        comment: string;
        title?: string | null | undefined;
        subtitle?: string | null | undefined;
        hook?: void | undefined;
        comment_full?: string | null | undefined;
    }[];
    area: {
        value: number;
        unit: string;
        total: number;
        weighted: number;
    };
    floor: {
        type: string;
        value: number;
        levels: number;
        floors: number;
    };
    orientations: string[];
    user: {
        id: number;
        agency: number;
        active: boolean;
        created_at: Date;
        updated_at: Date;
        firstname: string;
        lastname: string;
        language: string;
        group: string;
        email: string;
        phone: string | null;
        mobile: string;
        fax: string | null;
        birthday_at: Date;
        timezone: string | null;
        picture: string | null;
        username?: string | undefined;
        password?: string | undefined;
        spoken_languages?: string[] | undefined;
        city?: {
            id: number;
            name: string;
        } | null | undefined;
        partners?: unknown[] | undefined;
        stories?: unknown[] | undefined;
        rates?: unknown;
    };
    step: string;
    parent: number | null;
    category: string;
    subtype: string;
    agreement: {
        type: string;
        reference: string;
        start_at: Date;
        end_at: Date;
    } | null;
    block_name: string | null;
    lot_reference: string | null;
    cadastre_reference: string | null;
    stairs_reference: string | null;
    address: string | null;
    address_more: string | null;
    publish_address: boolean;
    country: string;
    region: {
        id: number;
        name: string;
    };
    district: {
        id: number;
        name: string;
    } | null;
    longitude: number;
    latitude: number;
    radius: number;
    altitude: number;
    plot: {
        net_floor: number;
        width: number;
        serviced_plot: boolean;
        land_type?: unknown;
        height?: number | undefined;
    };
    rooms: number;
    bedrooms: number;
    sleeps: number;
    price: {
        value: number;
        max: number;
        fees: number;
        period: string;
        hide: boolean;
        inventory: number | null;
        deposit: number | null;
        currency: string;
        commission: number | null;
        tenant: number | null;
        vat: boolean | null;
        unit?: unknown;
        transfer_tax?: unknown;
        contribution?: unknown;
        pension?: unknown;
    };
    residence: {
        id: number;
        type: string;
        fees: number;
        period: string;
        lots: number;
    } | null;
    view: {
        type: string;
        landscape: string[];
    } | null;
    construction: {
        construction_year: number;
        renovation_year: number;
        renovation_cost: number;
        construction_step: string;
        type?: string[] | undefined;
    };
    heating: {
        type: string;
        device: string;
        devices: string[] | null;
        access: string;
        types: string[] | null;
    };
    water: {
        hot_device: string;
        hot_access: string;
        waste: string;
    };
    condition: string;
    standing: string;
    style: {
        name: string | null;
    };
    twinned: number | null;
    availability: string;
    delivered_at: Date | null;
    activities: string[];
    services: string[];
    proximities: string[];
    tags: string[];
    tags_customized: unknown[];
    pictures: {
        id: number;
        rank: number;
        url: string;
        width_max: number;
        height_max: number;
        internet: boolean;
        print: boolean;
        panorama: boolean;
        child: number;
        comments: {
            language: string;
            comment: string;
            title?: string | null | undefined;
            subtitle?: string | null | undefined;
            hook?: void | undefined;
            comment_full?: string | null | undefined;
        }[];
        reference?: unknown;
    }[];
    medias: unknown[];
    documents: unknown[];
    areas: {
        number: number;
        type: string;
        comments: {
            language: string;
            comment: string;
            title?: string | null | undefined;
            subtitle?: string | null | undefined;
            hook?: void | undefined;
            comment_full?: string | null | undefined;
        }[];
        area: number;
        flooring: string;
        ceiling_height: number | null;
        floor: {
            type: string;
            value: number;
        };
        orientations: string[];
        lot: {
            name: unknown[];
            type?: unknown;
            rank?: unknown;
        };
    }[];
    regulations: {
        type: string;
        value: number[];
        date: Date | null;
        graph: string | null;
    }[];
    financial: unknown[];
    exchanges: unknown[];
    logs: unknown[];
    referrals: unknown[];
    created_by: number;
    updated_by: number;
    brand?: void | undefined;
    sector?: void | undefined;
    ranking?: void | undefined;
    original_city?: unknown;
    original_district?: unknown;
    location?: unknown;
    referral?: unknown;
    subreferral?: unknown;
    owner?: unknown;
    visit?: unknown;
    facades?: unknown;
    length?: unknown;
    height?: unknown;
    available_at?: void | null | undefined;
    filling_rate?: unknown;
    private_comment?: unknown;
    interagency_comment?: unknown;
    status_comment?: unknown;
}, {
    id: number;
    name: string | null;
    options: unknown[];
    type: number;
    status: number;
    agency: number;
    created_at: string;
    updated_at: string;
    city: {
        id: number;
        name: string;
        zipcode: string;
    };
    rates: unknown[];
    reference: number;
    url: string | null;
    comments: {
        language: string;
        comment: string;
        title?: string | null | undefined;
        subtitle?: string | null | undefined;
        hook?: unknown;
        comment_full?: string | null | undefined;
    }[];
    area: {
        value: number;
        unit: number;
        total: number;
        weighted: number;
    };
    floor: {
        type: number;
        value: number;
        levels: number;
        floors: number;
    };
    orientations: number[];
    user: {
        id: number;
        agency: number;
        active: boolean;
        created_at: string;
        updated_at: string;
        firstname: string;
        lastname: string;
        language: string;
        group: number;
        email: string;
        phone: string | null;
        mobile: string;
        fax: string | null;
        birthday_at: string;
        timezone: string | null;
        picture: string | null;
        username?: string | undefined;
        password?: string | undefined;
        spoken_languages?: string[] | undefined;
        city?: {
            id: number;
            name: string;
        } | null | undefined;
        partners?: unknown[] | undefined;
        stories?: unknown[] | undefined;
        rates?: unknown;
    };
    step: number;
    parent: number | null;
    category: number;
    subtype: number;
    agreement: {
        type: number;
        reference: string;
        start_at: string;
        end_at: string;
    } | null;
    block_name: string | null;
    lot_reference: string | null;
    cadastre_reference: string | null;
    stairs_reference: string | null;
    address: string | null;
    address_more: string | null;
    publish_address: boolean;
    country: string;
    region: {
        id: number;
        name: string;
    };
    district: {
        id: number;
        name: string;
    } | null;
    longitude: number;
    latitude: number;
    radius: number;
    altitude: number;
    plot: {
        net_floor: number;
        width: number;
        serviced_plot: boolean;
        land_type?: unknown;
        height?: number | undefined;
    };
    rooms: number;
    bedrooms: number;
    sleeps: number;
    price: {
        value: number;
        max: number;
        fees: number;
        period: number;
        hide: boolean;
        inventory: number | null;
        deposit: number | null;
        currency: string;
        commission: number | null;
        tenant: number | null;
        vat: boolean | null;
        unit?: unknown;
        transfer_tax?: unknown;
        contribution?: unknown;
        pension?: unknown;
    };
    residence: {
        id: number;
        type: number;
        fees: number;
        period: number;
        lots: number;
    } | null;
    view: {
        type: number;
        landscape: number[];
    } | null;
    construction: {
        construction_year: number;
        renovation_year: number;
        renovation_cost: number;
        construction_step: number;
        type?: number[] | undefined;
    };
    heating: {
        type: number;
        device: number;
        devices: number[] | null;
        access: number;
        types: number[] | null;
    };
    water: {
        hot_device: number;
        hot_access: number;
        waste: number;
    };
    condition: number;
    standing: number;
    style: {
        name: string | null;
    };
    twinned: number | null;
    availability: number;
    delivered_at: string | null;
    activities: number[];
    services: number[];
    proximities: number[];
    tags: number[];
    tags_customized: unknown[];
    pictures: {
        id: number;
        rank: number;
        url: string;
        width_max: number;
        height_max: number;
        internet: boolean;
        print: boolean;
        panorama: boolean;
        child: number;
        comments: {
            language: string;
            comment: string;
            title?: string | null | undefined;
            subtitle?: string | null | undefined;
            hook?: unknown;
            comment_full?: string | null | undefined;
        }[];
        reference?: unknown;
    }[];
    medias: unknown[];
    documents: unknown[];
    areas: {
        number: number;
        type: number;
        comments: {
            language: string;
            comment: string;
            title?: string | null | undefined;
            subtitle?: string | null | undefined;
            hook?: unknown;
            comment_full?: string | null | undefined;
        }[];
        area: number;
        flooring: number;
        ceiling_height: number | null;
        floor: {
            type: number;
            value: number;
        };
        orientations: number[];
        lot: {
            name: unknown[];
            type?: unknown;
            rank?: unknown;
        };
    }[];
    regulations: {
        type: number;
        value: string;
        date: string | null;
        graph: string | null;
    }[];
    financial: unknown[];
    exchanges: unknown[];
    logs: unknown[];
    referrals: unknown[];
    created_by: number;
    updated_by: number;
    brand?: unknown;
    sector?: unknown;
    ranking?: unknown;
    original_city?: unknown;
    original_district?: unknown;
    location?: unknown;
    referral?: unknown;
    subreferral?: unknown;
    owner?: unknown;
    visit?: unknown;
    facades?: unknown;
    length?: unknown;
    height?: unknown;
    available_at?: unknown;
    filling_rate?: unknown;
    private_comment?: unknown;
    interagency_comment?: unknown;
    status_comment?: unknown;
}>;

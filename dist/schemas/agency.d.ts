import { z } from "zod";
import { CatalogTransformer } from "./common";
export declare const RateSchema: (catalogTransformer: CatalogTransformer) => z.ZodObject<{
    id: z.ZodNumber;
    category: z.ZodEffects<z.ZodNumber, string | null, number>;
    range_min: z.ZodNullable<z.ZodNumber>;
    range_max: z.ZodNullable<z.ZodNumber>;
    commission_price: z.ZodNullable<z.ZodNumber>;
    commission_rate: z.ZodNullable<z.ZodNumber>;
    comment: z.ZodString;
    url: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: number;
    comment: string;
    url: string | null;
    category: string | null;
    range_min: number | null;
    range_max: number | null;
    commission_price: number | null;
    commission_rate: number | null;
}, {
    id: number;
    comment: string;
    url: string | null;
    category: number;
    range_min: number | null;
    range_max: number | null;
    commission_price: number | null;
    commission_rate: number | null;
}>;
export declare const getPartnerSchema: (catalogTransformer: CatalogTransformer) => z.ZodObject<{
    type: z.ZodNumber;
    partner: z.ZodNullable<z.ZodNumber>;
    name: z.ZodNullable<z.ZodString>;
    reference: z.ZodString;
    amount: z.ZodNumber;
    currency: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string | null;
    type: number;
    reference: string;
    currency: string;
    partner: number | null;
    amount: number;
}, {
    name: string | null;
    type: number;
    reference: string;
    currency: string;
    partner: number | null;
    amount: number;
}>;
export declare const getAgencySchema: (catalogTransformer: CatalogTransformer) => z.ZodObject<{
    id: z.ZodNumber;
    reference: z.ZodNumber;
    active: z.ZodBoolean;
    name: z.ZodString;
    company: z.ZodObject<{
        id: z.ZodNumber;
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: number;
        name: string;
    }, {
        id: number;
        name: string;
    }>;
    brand: z.ZodUnknown;
    networks: z.ZodArray<z.ZodUnknown, "many">;
    address: z.ZodString;
    address_more: z.ZodNullable<z.ZodString>;
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
    district: z.ZodUnknown;
    country: z.ZodString;
    region: z.ZodString;
    latitude: z.ZodNumber;
    longitude: z.ZodNumber;
    email: z.ZodString;
    phone: z.ZodString;
    fax: z.ZodNullable<z.ZodString>;
    url: z.ZodString;
    logo: z.ZodString;
    logo_svg: z.ZodNullable<z.ZodString>;
    picture: z.ZodString;
    currency: z.ZodString;
    timetable: z.ZodString;
    created_at: z.ZodEffects<z.ZodString, Date, string>;
    updated_at: z.ZodEffects<z.ZodString, Date, string>;
    providers: z.ZodEffects<z.ZodString, string, string>;
    rates: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        category: z.ZodEffects<z.ZodNumber, string | null, number>;
        range_min: z.ZodNullable<z.ZodNumber>;
        range_max: z.ZodNullable<z.ZodNumber>;
        commission_price: z.ZodNullable<z.ZodNumber>;
        commission_rate: z.ZodNullable<z.ZodNumber>;
        comment: z.ZodString;
        url: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: number;
        comment: string;
        url: string | null;
        category: string | null;
        range_min: number | null;
        range_max: number | null;
        commission_price: number | null;
        commission_rate: number | null;
    }, {
        id: number;
        comment: string;
        url: string | null;
        category: number;
        range_min: number | null;
        range_max: number | null;
        commission_price: number | null;
        commission_rate: number | null;
    }>, "many">;
    partners: z.ZodArray<z.ZodObject<{
        type: z.ZodNumber;
        partner: z.ZodNullable<z.ZodNumber>;
        name: z.ZodNullable<z.ZodString>;
        reference: z.ZodString;
        amount: z.ZodNumber;
        currency: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string | null;
        type: number;
        reference: string;
        currency: string;
        partner: number | null;
        amount: number;
    }, {
        name: string | null;
        type: number;
        reference: string;
        currency: string;
        partner: number | null;
        amount: number;
    }>, "many">;
    stories: z.ZodArray<z.ZodUnknown, "many">;
    users: z.ZodArray<z.ZodObject<{
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
        group: z.ZodEffects<z.ZodNumber, string | null, number>;
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
        group: string | null;
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
    }>, "many">;
    sectors: z.ZodArray<z.ZodUnknown, "many">;
    parameters: z.ZodString;
    subscription: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: number;
    name: string;
    active: boolean;
    created_at: Date;
    updated_at: Date;
    email: string;
    phone: string;
    fax: string | null;
    city: {
        id: number;
        name: string;
        zipcode: string;
    };
    picture: string;
    partners: {
        name: string | null;
        type: number;
        reference: string;
        currency: string;
        partner: number | null;
        amount: number;
    }[];
    stories: unknown[];
    rates: {
        id: number;
        comment: string;
        url: string | null;
        category: string | null;
        range_min: number | null;
        range_max: number | null;
        commission_price: number | null;
        commission_rate: number | null;
    }[];
    reference: number;
    currency: string;
    url: string;
    address: string;
    address_more: string | null;
    country: string;
    region: string;
    longitude: number;
    latitude: number;
    company: {
        id: number;
        name: string;
    };
    networks: unknown[];
    logo: string;
    logo_svg: string | null;
    timetable: string;
    providers: string;
    users: {
        id: number;
        agency: number;
        active: boolean;
        created_at: Date;
        updated_at: Date;
        firstname: string;
        lastname: string;
        language: string;
        group: string | null;
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
    }[];
    sectors: unknown[];
    parameters: string;
    subscription: string;
    brand?: unknown;
    district?: unknown;
}, {
    id: number;
    name: string;
    active: boolean;
    created_at: string;
    updated_at: string;
    email: string;
    phone: string;
    fax: string | null;
    city: {
        id: number;
        name: string;
        zipcode: string;
    };
    picture: string;
    partners: {
        name: string | null;
        type: number;
        reference: string;
        currency: string;
        partner: number | null;
        amount: number;
    }[];
    stories: unknown[];
    rates: {
        id: number;
        comment: string;
        url: string | null;
        category: number;
        range_min: number | null;
        range_max: number | null;
        commission_price: number | null;
        commission_rate: number | null;
    }[];
    reference: number;
    currency: string;
    url: string;
    address: string;
    address_more: string | null;
    country: string;
    region: string;
    longitude: number;
    latitude: number;
    company: {
        id: number;
        name: string;
    };
    networks: unknown[];
    logo: string;
    logo_svg: string | null;
    timetable: string;
    providers: string;
    users: {
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
    }[];
    sectors: unknown[];
    parameters: string;
    subscription: string;
    brand?: unknown;
    district?: unknown;
}>;

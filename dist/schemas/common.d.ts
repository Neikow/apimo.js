import { z } from "zod";
export interface CatalogTransformer {
    (key: string, value: number): string | null;
}
export declare const NameIdPairSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: number;
    name: string;
}, {
    id: number;
    name: string;
}>;
export declare const CitySchema: z.ZodObject<{
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
export declare const getUserSchema: (catalogTransformer: CatalogTransformer) => z.ZodObject<{
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
}>;

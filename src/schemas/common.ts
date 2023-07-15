import {unknown, z} from "zod";
import Apimo from "../core";

export interface CatalogTransformer {
    (key: string, value: number): string;
}

export const NameIdPairSchema = z.object({
    id: z.coerce.number(),
    name: z.string()
});

export const CitySchema = NameIdPairSchema.extend({
    zipcode: z.string(),
});

export const getUserSchema = (catalogTransformer: CatalogTransformer) =>
    z.object({
            id: z.coerce.number(),
            agency: z.coerce.number(),
            active: z.boolean(),
            created_at: z.string().transform(Apimo.convertDate),
            updated_at: z.string().transform(Apimo.convertDate),
            firstname: z.string(),
            lastname: z.string(),
            username: z.string().optional(),
            password: z.string().optional(),
            language: z.string(),
            spoken_languages: z.string().array().optional(),
            group: z.coerce.number().transform(v => catalogTransformer('user_group', v)),
            email: z.string().email(),
            phone: z.string().nullable(),
            mobile: z.string(),
            fax: z.string().nullable(),
            city: NameIdPairSchema.nullable().optional(),
            birthday_at: z.string().transform(v => {
                const [YYYY, MM, DD] = v.split('-');
                return new Date(parseInt(YYYY), parseInt(MM) - 1, parseInt(DD));
            }),
            timezone: z.string().nullable(),
            picture: z.string().nullable(),
            partners: unknown().array().optional(),
            stories: unknown().array().optional(),
            rates: unknown(),
        }
    );
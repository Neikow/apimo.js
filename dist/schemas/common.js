"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserSchema = exports.CitySchema = exports.NameIdPairSchema = void 0;
const zod_1 = require("zod");
const core_1 = __importDefault(require("../core"));
exports.NameIdPairSchema = zod_1.z.object({
    id: zod_1.z.coerce.number(),
    name: zod_1.z.string()
});
exports.CitySchema = exports.NameIdPairSchema.extend({
    zipcode: zod_1.z.string(),
});
const getUserSchema = (catalogTransformer) => zod_1.z.object({
    id: zod_1.z.coerce.number(),
    agency: zod_1.z.coerce.number(),
    active: zod_1.z.boolean(),
    created_at: zod_1.z.string().transform(core_1.default.convertDate),
    updated_at: zod_1.z.string().transform(core_1.default.convertDate),
    firstname: zod_1.z.string(),
    lastname: zod_1.z.string(),
    username: zod_1.z.string().optional(),
    password: zod_1.z.string().optional(),
    language: zod_1.z.string(),
    spoken_languages: zod_1.z.string().array().optional(),
    group: zod_1.z.coerce.number().transform(v => catalogTransformer('user_group', v)),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string().nullable(),
    mobile: zod_1.z.string(),
    fax: zod_1.z.string().nullable(),
    city: exports.NameIdPairSchema.nullable().optional(),
    birthday_at: zod_1.z.string().transform(v => {
        const [YYYY, MM, DD] = v.split('-');
        return new Date(parseInt(YYYY), parseInt(MM) - 1, parseInt(DD));
    }),
    timezone: zod_1.z.string().nullable(),
    picture: zod_1.z.string().nullable(),
    partners: (0, zod_1.unknown)().array().optional(),
    stories: (0, zod_1.unknown)().array().optional(),
    rates: (0, zod_1.unknown)(),
});
exports.getUserSchema = getUserSchema;

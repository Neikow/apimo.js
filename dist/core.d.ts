import { z } from "zod";
import { getPropertySchema } from "./schemas/property";
import { getAgencySchema } from "./schemas/agency";
export interface ApimoSettings {
    debug?: boolean;
    culture?: string;
    id?: number;
    cacheRequests?: boolean;
}
export type Catalog = Record<string, Record<number, string>>;
export type Property = z.infer<ReturnType<typeof getPropertySchema>>;
export type Agency = z.infer<ReturnType<typeof getAgencySchema>>;
export type PathPart = '$agency$' | string;
export default class Apimo {
    private provider;
    private token;
    static basePath: string;
    ready: Promise<boolean>;
    private readonly _debug;
    private readonly _culture;
    private catalog;
    private catalogPromise;
    private properties;
    private agencyPromise;
    private _useCache;
    constructor(provider: string, token: string, settings?: ApimoSettings);
    static convertDate(s: string): Date;
    get(path: PathPart[], params?: {
        [key: string]: unknown;
    }): Promise<unknown>;
    fetchCatalog(): Promise<Catalog>;
    getAgencies(): Promise<Agency[]>;
    getProperties(): Promise<Property[]>;
    private useDebug;
    private _normalizeURL;
    private getCatalog;
    private parseCatalog;
    private saveCatalog;
    private _getDefaultAgency;
    private getCatalogTransformer;
    private _getAuthorizationHeader;
}

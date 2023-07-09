import { Catalog, CatalogResponse, Property, RawAgency } from "./types";
export default class Apimo {
    private provider;
    private token;
    basePath: string;
    timestamps: Map<string, number>;
    private readonly _debug;
    private readonly cultures;
    private catalogs;
    private catalogsPromise;
    private properties;
    private catalogsInterval;
    private propertiesInterval;
    private readonly agencyIdPromise;
    constructor(provider: string, token: string, settings?: ApimoSettings);
    get(path: string[], params?: {
        [key: string]: unknown;
    }): Promise<unknown>;
    getCatalogs(): Promise<Catalog[]>;
    getCatalog(id: string, culture: string): Promise<CatalogResponse>;
    getAgencies(): Promise<RawAgency[]>;
    getProperties(id?: string, params?: {
        [key: string]: any;
    }): Promise<Map<string, Property>>;
    private _getDefaultAgency;
    private _updateCatalogs;
    private _getAuthorizationHeader;
    private _getLocalized;
    private _rawPropertyToProperty;
}
export type ApimoSettings = {
    debug?: boolean;
    cultures: string[];
    id?: string;
    updateIntervals: {
        catalogs: number;
        properties: number;
    };
};

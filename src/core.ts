import {z} from "zod";
import {getPropertySchema} from "./schemas/property";
import {getAgencySchema} from "./schemas/agency";
import axios from "axios";
import {CatalogTransformer} from "./schemas/common";
import * as fs from "fs";

export interface ApimoSettings {
    debug?: boolean;
    culture?: string;
    id?: number;
    cacheRequests?: boolean;
}

export type Catalog = Record<string, Record<number, string>>;

export type Property = z.infer<ReturnType<typeof getPropertySchema>>

export type Agency = z.infer<ReturnType<typeof getAgencySchema>>;

export type PathPart = '$agency$' | string

export default class Apimo {
    static basePath = 'https://api.apimo.pro/';
    public ready = Promise.resolve(false);
    private readonly _debug: boolean = false;
    private readonly _culture: string = 'en';
    private catalog: Catalog = {};
    private catalogPromise: Promise<typeof this.catalog>
    private properties: Map<string, Property> = new Map();
    private agencyPromise: Promise<Agency>;
    private _useCache: boolean = false;

    constructor(private provider: string, private token: string, settings?: ApimoSettings) {
        this._debug = settings?.debug ?? false;
        this._culture = settings?.culture ?? 'en';
        this._useCache = settings?.cacheRequests ?? false;

        this.agencyPromise = this._getDefaultAgency(settings?.id);

        this.agencyPromise.then(a => {
            this.useDebug(`🏢 Agency ID: ${a.id}`);
        });

        this.catalogPromise = this.fetchCatalog();
        this.catalogPromise.then(c => this.catalog = c);

        if (this._useCache && !fs.existsSync('./cache')) {
            fs.mkdirSync('./cache');
        }

        Promise.all([this.agencyPromise, this.catalogPromise]).then(() => {
            this.useDebug('📣 Apimo API client initialized');
            this.ready = Promise.resolve(true);
        });
    }

    public static convertDate(s: string): Date {
        const [YYYY, MM, DD] = s.split('-');
        return new Date(parseInt(YYYY), parseInt(MM) - 1, parseInt(DD));
    }

    public async get(path: PathPart[], params?: { [key: string]: unknown }): Promise<unknown> {
        let agency: Agency;
        if (path.includes('$agency$')) {
            agency = await this.agencyPromise
        }

        const url = Apimo.basePath + path.map((p) => p === '$agency$' ? agency.id : p).join('/');

        const cacheURL = this._normalizeURL(url);
        if (this._useCache && fs.existsSync(cacheURL)) {
            this.useDebug('📁 Cache hit, returning cached value: ' + cacheURL);

            const file = fs.readFileSync(cacheURL, 'utf-8');
            const obj = JSON.parse(file);
            const cacheSchema = z.object({
                timestamp: z.coerce.number(),
                value: z.any(),
            });

            const result = cacheSchema.parse(obj);

            if (Date.now() - result.timestamp < 3600 * 1000) { // 1 hour
                return result.value;
            }
            this.useDebug('📁 Cache expired, fetching from API');
        }

        this.useDebug(`🔎 Accessing: GET ${url}`);

        let res;
        try {
            res = await axios.get(url, {
                method: 'get',
                headers: {
                    "Content-Type": "application/json",
                    ...this._getAuthorizationHeader(),
                },
                params: params,
            });
        } catch (e) {
            if (e instanceof Error) {
                throw new Error(`🚨 ${e.message}`);
            } else {
                throw new Error(`🚨 Unknown error : ${e}`);
            }
        }

        const json = res.data;

        if (json.status) {
            throw new Error(`⚠️ ${json.title} (${json.status}): ${json.message}`);
        }

        if (this._useCache) {
            if (!fs.existsSync('./cache')) {
                fs.mkdirSync('./cache');
            }
            try {
                this.useDebug('📁 Writing cache file for request ' + url);
                fs.writeFileSync(cacheURL, JSON.stringify({
                    timestamp: Date.now(),
                    value: json,
                }));
            } catch (e) {
                throw new Error(`🚨 Could not write cache file: ${e}`);
            }
        }

        return json;
    }

    public async fetchCatalog(): Promise<Catalog> {
        const startTime = Date.now();
        this.useDebug('📁 Fetching catalogs from API');

        let apimoCatalogs;
        try {
            apimoCatalogs = await this.get(['catalogs']);
        } catch (e) {
            return new Promise((resolve, reject) => {
                if (fs.existsSync('./cache/catalog.json')) {
                    this.useDebug('📁 Unable to fetch catalogs from API, using cached version');
                    return this.parseCatalog(true);
                }
                this.useDebug('🚨 Unable to fetch catalogs from cache, retrying to fetch from API in 5 minutes');
                setTimeout(() => {
                    this.fetchCatalog().then(resolve).catch(reject);
                }, 5 * 60 * 1000);
            });
        }

        const result = z.object({
            name: z.string(),
            path: z.string().url(),
        }).array();

        const catalogs = result.parse(apimoCatalogs);

        const catalog: Catalog = {};

        for (const c of catalogs) {
            const catalogName = c.name;

            const catalogJson = await this.get(['catalogs', catalogName]);
            const catalogResult = z.object({
                id: z.coerce.number(),
                culture: z.string(),
                name: z.string(),
                name_plural: z.string().optional(),
            }).array();

            const catalogValues = catalogResult.parse(catalogJson).values();

            const catalogMap: Record<number, string> = {};

            for (const {id, name} of catalogValues) {
                catalogMap[id] = name;
            }

            catalog[catalogName] = catalogMap;
        }

        const endTime = Date.now();
        this.useDebug('📁 Loaded catalogs from API in ' + (endTime - startTime) + 'ms');

        return catalog;
    }

    public async getAgencies(): Promise<Agency[]> {
        const json = await this.get(['agencies']);
        const result = z.object({
            total_items: z.number(),
            agencies: getAgencySchema(await this.getCatalogTransformer()).array(),
        });

        return result.parse(json).agencies;
    }

    public async getProperties(): Promise<Property[]> {
        const response = await this.get(['agencies', '$agency$', 'properties']);

        const result = z.object({
            total_items: z.number(),
            timestamp: z.number(),
            processing_time: z.number(),
            properties: getPropertySchema(await this.getCatalogTransformer()).array(),
        }).parse(response);

        return result.properties;
    }

    private useDebug(...msg: any[]) {
        if (this._debug) {
            console.log(...msg);
        }
    }

    private _normalizeURL(url: string): string {
        return './cache/' + url.replace(Apimo.basePath, '').replace(/\//g, '_');
    }

    private async getCatalog(force = false): Promise<Catalog> {
        if (force) {
            this.catalogPromise = this.fetchCatalog();
            this.catalog = await this.catalogPromise;
            await this.saveCatalog();
            return this.catalog;
        }

        if (fs.existsSync('./cache/catalog.json')) {
            return this.parseCatalog();
        }

        return this.getCatalog(true);
    }

    private async parseCatalog(ignoreExpiration = false): Promise<Catalog> {
        const catalogString = await new Promise<string>((resolve, reject) => {
            fs.readFile('./cache/catalog.json', 'utf8', (err, data) => {
                if (err) return reject(err);
                resolve(data);
            });
        });

        let catalogObject;
        try {
            catalogObject = JSON.parse(catalogString);
        } catch (e) {
            this.useDebug('📁 Catalog cache is invalid');
            return this.getCatalog(true);
        }

        const cacheSchema = z.object({
            timestamp: z.number(),
            catalog: z.record(z.string(), z.record(z.coerce.number(), z.string())),
        });

        const cache = cacheSchema.parse(catalogObject);

        if (!ignoreExpiration && (Date.now() - cache.timestamp > 86400000)) {
            this.useDebug('📁 Catalog cache is outdated');
            return this.getCatalog(true);
        }

        this.useDebug('📁 Catalog loaded from cache');
        return cache.catalog;
    }

    private async saveCatalog() {
        const cache = JSON.stringify({
            timestamp: Date.now(),
            catalog: this.catalog,
        });

        await new Promise<void>((resolve, reject) => {
            fs.writeFile('catalog.json', cache, 'utf8', (err) => {
                if (err) return reject(err);
                this.useDebug('📁 Catalog saved to cache');
                resolve();
            });
        })
    }

    private async _getDefaultAgency(id?: number): Promise<Agency> {
        const agencies = await this.getAgencies();

        if (id) {
            const agency = agencies[id];
            if (agency) {
                return agency;
            } else {
                throw new Error(`🚨 Agency ${id} not found`);
            }
        }

        if (agencies.length === 1) {
            return agencies[0];
        }

        throw new Error(`🚨 Multiple agencies found, please specify an ID: ${agencies.map(a => a.id).join(', ')}`);
    }

    private async getCatalogTransformer(): Promise<CatalogTransformer> {
        await this.catalogPromise;
        return (key: string, value: number): string | null => {
            if (!(key in this.catalog)) {
                throw new Error(`🚨 Catalog \`${key}\` not found`);
            }
            const res = this.catalog[key][value]
            if (!res) {
                return null;
            }
            return res.replace(/[ -]/g, '_').replace(/(«_|_»)/g, '').replace('___', '_').toLowerCase();
        }
    }

    private _getAuthorizationHeader() {
        return {
            'Authorization': `Basic ${btoa(this.provider + ':' + this.token)}`,
        }
    }
}
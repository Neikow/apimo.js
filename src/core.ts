import * as fs from "fs";
import axios from "axios";
import {
    AgenciesResponse,
    Catalog,
    CatalogResponse,
    CatalogsResponse,
    Localized,
    PropertiesResponse,
    Property,
    RawAgency,
    RawProperty
} from "../types";

export default class Apimo {
    basePath = 'https://api.apimo.pro/';

    timestamps: Map<string, number>;

    private readonly _debug: boolean = false;

    private readonly cultures;

    private catalogs: Map<string, Map<string, Localized>> | undefined
    private catalogsPromise: Promise<typeof this.catalogs>;

    private properties = new Map<string, Property>();

    private catalogsInterval: NodeJS.Timeout | undefined;
    private propertiesInterval: NodeJS.Timeout | undefined;

    private readonly agencyIdPromise: Promise<string>;

    constructor(private provider: string, private token: string, settings?: ApimoSettings) {
        this._debug = settings?.debug || false;
        this.cultures = settings?.cultures || ['en_GB'];

        if (settings?.updateIntervals?.catalogs || settings?.updateIntervals?.properties) {
            this._debug && console.log('📣 Automatic updates enabled');
        }

        this.agencyIdPromise = settings?.id ? Promise.resolve(settings.id) : this._getDefaultAgency();

        this.agencyIdPromise.then((id) => {
            this._debug && console.log(`🏢 Agency ID: ${id}`);
        });

        this._debug && console.log('📣 Apimo API client initialized');

        this.timestamps = new Map<string, number>();

        this.catalogsPromise = this._updateCatalogs();
        this.catalogsPromise.then((c) => {
            this.catalogs = c;
        });

        if (settings?.updateIntervals?.catalogs) {
            this.catalogsInterval = setInterval(() => {
                this.catalogsPromise = this._updateCatalogs(true);
                this.catalogsPromise.then((c) => {
                    this.catalogs = c;
                });
            }, settings?.updateIntervals?.catalogs);
        }

        if (settings?.updateIntervals?.properties) {
            this.propertiesInterval = setInterval(async () => {
                this.properties = await this.getProperties(await this.agencyIdPromise);
            }, settings?.updateIntervals?.properties);
        }
    }

    public async get(path: string[], params ?: { [key: string]: unknown }): Promise<unknown> {
        const url = this.basePath + path.join('/');

        this._debug && console.log(`🔌 Accessing: ${url}`);

        let res;
        try {
            res = await axios.get(url, {
                method: 'get',
                headers: {
                    "Content-Type": "application/json",
                    ...this._getAuthorizationHeader(),
                },
                data: JSON.stringify(params),
            });
        } catch (e) {
            if (e && typeof e === 'object' && 'message' in e) {
                throw new Error(`⚠️ ${e.message}`);
            }
            throw new Error(`⚠️ ${e}`);
        }

        const json = res.data;

        if (json.status
        ) {
            throw new Error(`⚠️ ${json.title} (${json.status}): ${json.message}`);
        }

        return json;
    }

    public async getCatalogs(): Promise<Catalog[]> {
        const res = (await this.get(['catalogs'])) as CatalogsResponse;

        this.timestamps.set('catalogs', Date.now());

        return res;
    }

    public async getCatalog(id: string, culture: string): Promise<CatalogResponse> {
        return await this.get(['catalogs', id], {culture}) as CatalogResponse;
    }

    public async getAgencies(): Promise<RawAgency[]> {
        const result = await this.get(['agencies']) as AgenciesResponse;
        return result.agencies;
    }

    public async getProperties(id?: string, params?: { [key: string]: any }): Promise<Map<string, Property>> {
        const path = ['agencies', id ?? await this.agencyIdPromise, 'properties'];

        await this.catalogsPromise;

        const res = (await this.get(path, {
            timestamp: (this.timestamps.get(path.join('/')) ?? 0),
            ...params,
        })) as PropertiesResponse;

        this.timestamps.set(path.join('/'), res.timestamp - 1);

        const properties = new Map<string, Property>();

        for (const property of res.properties) {
            properties.set(property.id.toString(), this._rawPropertyToProperty(property));
        }

        return properties;
    }

    private _getDefaultAgency(): Promise<string> {
        return new Promise(async (resolve) => {
            const agencies = await this.getAgencies();

            if (agencies.length === 0) {
                throw new Error('⚠️ No agencies found');
            }

            if (agencies.length > 1) {
                throw new Error(`⚠️ Multiple agencies found:\n ${agencies.map((a) => `${a.id}: ${a.name}`).join('\n')}}`);
            }

            resolve(agencies[0].id);
        });
    }

    private _updateCatalogs(forceUpdate = false): Promise<Map<string, Map<string, Localized>>> {
        if (!forceUpdate && fs.existsSync('catalogs.json')) {
            return new Promise(async (resolve) => {
                this._debug && console.log('📁 Loading catalogs from cache');
                const startTime = Date.now();

                const cacheString = fs.readFileSync('catalogs.json', 'utf8');

                let catalogCache: any;

                try {
                    catalogCache = JSON.parse(cacheString);
                } catch (e) {
                    this._debug && console.log('⚠️ Invalid catalogs cache.');
                    this._updateCatalogs(true).then(resolve);
                    return;
                }

                if (!catalogCache.timestamp || !catalogCache.catalogs) {
                    this._debug && console.log('⚠️ Invalid catalogs cache.');
                    this._updateCatalogs(true).then(resolve);
                    return;
                }

                const cacheTimestamp = catalogCache.timestamp;
                if (isNaN(parseInt(cacheTimestamp))) {
                    this._debug && console.log('⚠️ Invalid catalogs cache.');
                    this._updateCatalogs(true).then(resolve);
                    return;
                }

                const cachedCatalogs = Object.keys(catalogCache.catalogs);

                if (cachedCatalogs.length === 0) {
                    this._debug && console.log('⚠️ Empty catalogs cache.');
                    this._updateCatalogs(true).then(resolve);
                    return;
                }

                const result = new Map<string, Map<string, Localized>>();

                let hasError = false;
                catalog: for (const catalog of cachedCatalogs) {
                    const collection = new Map<string, Localized>();

                    const keys = Object.keys(catalogCache.catalogs[catalog]);

                    if (keys.length === 0) {
                        hasError = true;
                        break;
                    }

                    for (const key of keys) {
                        const localized = catalogCache.catalogs[catalog][key] as Localized;

                        if (!localized) {
                            hasError = true;
                            break catalog;
                        }

                        collection.set(key, localized);
                    }

                    result.set(catalog, collection);
                }

                if (hasError) {
                    this._debug && console.log('⚠️ Invalid catalogs cache.');
                    this._updateCatalogs(true).then(resolve);
                    return;
                }

                const endTime = Date.now();

                this._debug && console.log('📁 Loaded catalogs from cache in ' + (endTime - startTime) + 'ms');

                resolve(result);
            });
        }

        const promise = new Promise<Map<string, Map<string, Localized>>>(async (resolve, reject) => {
                try {
                    const startTime = Date.now();

                    this._debug && console.log('📁 Fetching catalogs from API');

                    const catalogsList = await this.getCatalogs();

                    const catalogs = new Map<string, Map<string, Localized>>()


                    for (const catalog of catalogsList) {
                        const collection = new Map<string, Localized>();

                        for (const culture of this.cultures) {
                            const entries = await this.getCatalog(catalog.name, culture);

                            entries.forEach((entry) => {
                                if (!collection.has(String(entry.id))) {
                                    collection.set(String(entry.id), {
                                        [entry.culture]: {
                                            id: entry.id,
                                            name: entry.name,
                                        },
                                    });
                                } else {
                                    collection.get(String(entry.id))![entry.culture] = {
                                        id: entry.id,
                                        name: entry.name,
                                    }
                                }
                            });
                        }


                        catalogs.set(catalog.name, collection);
                    }

                    const endTime = Date.now();

                    this._debug && console.log('📁 Loaded catalogs from API in ' + (endTime - startTime) + 'ms');

                    resolve(catalogs);
                } catch
                    (e) {
                    reject(e);
                }
            }
        );

        promise.then((catalogs) => {
            try {
                // The first line is the timestamp
                const cache = JSON.stringify({
                    timestamp: Date.now(),
                    catalogs: catalogs,
                }, (key, value) => {
                    if (value instanceof Map) {
                        return Object.fromEntries(value);
                    }

                    return value;
                });

                fs.writeFileSync('catalogs.json', cache);
                this._debug && console.log('📁 Saved catalogs to cache');
            } catch (e) {
                console.log(e);
            }
        });


        return promise;

    }

    private _getAuthorizationHeader() {
        return {
            'Authorization': `Basic ${btoa(this.provider + ':' + this.token)}`,
        }
    }

    private _getLocalized(key: string, id: number | string): Localized {
        if (!this.catalogs) throw new Error('💥 Catalogs not loaded');
        const entries = this.catalogs.get(key);
        if (!entries) throw new Error(`💥 Catalog \`${key}\` not found`);
        const value = entries.get(String(id));
        if (!value) throw new Error(`💥 Catalog \`${key}\` entry \`${id}\` not found`);

        return value;
    }

    private _rawPropertyToProperty(property: RawProperty): Property {
        return {
            ...property,
            agencyId: property.agency,
            url: property.url,
            delivered_at: property.delivered_at ? new Date(property.delivered_at) : undefined,
            name: property.name ?? '',
            user: [{
                ...property.user,
                id: parseInt(property.user.id),
                agency: parseInt(property.user.agency),
                city: {
                    id: parseInt(property.user.city?.id ?? '-1'),
                    name: property.user.city?.name ?? '',
                    zipcode: 'FIXME',
                },
                group: parseInt(property.user.group),
            }],
            city: {
                id: property.city.id,
                name: property.city.name,
                zipcode: property.city.zipcode,
            },
            agreement: property.agreement ? {
                type: property.agreement.type ? this._getLocalized('property_agreement', property.agreement.type) : undefined,
                reference: property.agreement.reference ?? '',
                start_at: property.agreement.start_at ? new Date(property.agreement.start_at) : undefined,
                end_at: property.agreement.end_at ? new Date(property.agreement.end_at) : undefined,
            } : undefined,
            step: this._getLocalized('property_step', property.step),
            status: this._getLocalized('property_status', property.status),
            parent: property.parent ?? undefined,
            category: this._getLocalized('property_category', property.category),
            subcategory: property.subcategory ? this._getLocalized('property_subcategory', property.subcategory) : undefined,
            type: this._getLocalized('property_type', property.type),
            subtype: this._getLocalized('property_subtype', property.subtype),
            area: [
                {
                    ...property.area,
                    unit: this._getLocalized('unit_area', property.area.unit),
                }
            ],
            price: [
                {
                    ...property.price,
                    unit: property.price.unit ? this._getLocalized('unit_area', property.price.unit) : undefined,
                    value: property.price.value ?? -1,
                    max: property.price.max ?? -1,
                    fees: property.price.fees ?? -1,
                    period: property.price.period ?? -1,
                    inventory: property.price.inventory ?? -1,
                    deposit: property.price.deposit ?? -1,
                    tenant: property.price.tenant ?? -1,
                    vat: property.price.vat || false,
                }
            ],
            residence: property.residence ? [{
                id: property.residence.id ?? -1,
                type: property.residence.type ? this._getLocalized('property_building', property.residence.type) : undefined,
                fees: property.residence.fees ?? -1,
                period: property.residence.period ?? -1,
                lots: property.residence.lots ?? -1,
            }] : [],
            view: property.view.type ? [
                {
                    ...property.view,
                    type: this._getLocalized('property_view_type', property.view.type),
                }
            ] : [],
            construction: property.construction ? {
                method: property.construction.method ? property.construction.method.map((method) => this._getLocalized('property_construction_method', method)) : [],
                construction_step: property.construction.construction_step ? this._getLocalized('construction_step', property.construction.construction_step) : undefined,
                construction_year: parseInt(property.construction.construction_year ?? '-1'),
                renovation_cost: property.construction.renovation_cost ?? '',
                renovation_year: parseInt(property.construction.renovation_year ?? '-1'),

            } : undefined,
            floor: {
                type: property.floor.type ? this._getLocalized('property_floor', property.floor.type) : undefined,
                floors: parseInt(property.floor.floors ?? '-1'),
                value: property.floor.value ?? -1,
                levels: parseInt(property.floor.levels ?? '-1'),
            },
            heating: property.heating ? [{
                device: property.heating.device ? this._getLocalized('property_heating_device', property.heating.device) : undefined,
                access: property.heating.access ? this._getLocalized('property_heating_access', property.heating.access) : undefined,
                type: property.heating.type ? this._getLocalized('property_heating_type', property.heating.type) : undefined,
                types: property.heating.types ? property.heating.types.map((type) => this._getLocalized('property_heating_type', type)) : [],
                devices: property.heating.devices ? property.heating.devices.map((device) => this._getLocalized('property_heating_device', device)) : [],
            }] : [],
            water: property.water ? [{
                hot_device: property.water.hot_device ? this._getLocalized('property_hot_water_device', property.water.hot_device) : undefined,
                hot_access: property.water.hot_access ? this._getLocalized('property_hot_water_access', property.water.hot_access) : undefined,
                waste: property.water.waste ? this._getLocalized('property_waste_water', property.water.waste) : undefined,
            }] : [],
            condition: property.condition ? this._getLocalized('property_condition', property.condition) : undefined,
            standing: property.standing ? this._getLocalized('property_standing', property.standing) : undefined,
            availability: property.availability ? this._getLocalized('property_availability', property.availability) : undefined,
            activities: property.activities ? property.activities.map((activity) => this._getLocalized('property_activity', activity)) : [],
            orientations: property.orientations ? property.orientations.map((orientation) => this._getLocalized('property_orientation', orientation)) : [],
            services: property.services ? property.services.map((service) => this._getLocalized('property_service', service)) : [],
            proximities: property.proximities ? property.proximities.map((proximity) => this._getLocalized('property_proximity', proximity)) : [],
            tags: property.tags ? property.tags.map((tag) => this._getLocalized('tags', tag)) : [],
            tags_customized: [{
                comment: 'Not implemented'
            }],
            pictures: property.pictures ? property.pictures.map((picture) => ({
                ...picture,
                internet: Boolean(picture.internet),
                print: Boolean(picture.print),
                panorama: Boolean(picture.panorama),
                child: Boolean(picture.child),
            })) : [],
            medias: property.medias ? property.medias.map((media) => ({
                ...media,
            })) : [],
            documents: property.documents ? property.documents.map((document) => ({
                ...document,
            })) : [],
            comments: property.comments ? property.comments.map((comment) => ({
                ...comment,
            })) : [],
            areas: property.areas ? property.areas.map((area) => ({
                area: area.area ?? -1,
                type: area.type ? this._getLocalized('property_areas', area.type) : undefined,
                flooring: area.flooring ? this._getLocalized('property_flooring', area.flooring) : undefined,
                floor: area.floor && (area.floor.type || area.floor.value) ? [{
                    type: area.floor.type ? this._getLocalized('property_floor', area.floor.type) : undefined,
                    value: area.floor.value ?? -1,
                }] : [],
                number: area.number
            })) : [],
            regulations: property.regulations ? property.regulations.map((regulation) => ({
                ...regulation,
                type: regulation.type ? this._getLocalized('property_regulation', regulation.type) : undefined,
                date: new Date(regulation.date),
                graph: regulation.graph ?? undefined,
            })) : [],
            plot: {
                ...property.plot,
                net_floor: property.plot.net_floor,
            },
            created_at: new Date(property.created_at),
            created_by: parseInt(property.created_by),
            updated_at: new Date(property.updated_at),
            updated_by: parseInt(property.updated_by)
        };
    }
}

export type ApimoSettings = {
    debug?: boolean,    // Whether to log debug messages
    cultures: string[],         // The cultures to fetch catalogs for
    id?: string,                 // The Apimo ID of the agency, if not provided, the first agency will be used
    updateIntervals: {
        catalogs: number,       // The interval in milliseconds between catalog updates
        properties: number,     // The interval in milliseconds between property updates
    }
}
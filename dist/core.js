"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const axios_1 = __importDefault(require("axios"));
class Apimo {
    constructor(provider, token, settings) {
        var _a, _b, _c, _d, _e, _f;
        this.provider = provider;
        this.token = token;
        this.basePath = 'https://api.apimo.pro/';
        this._debug = false;
        this.properties = new Map();
        this._debug = (settings === null || settings === void 0 ? void 0 : settings.debug) || false;
        this.cultures = (settings === null || settings === void 0 ? void 0 : settings.cultures) || ['en_GB'];
        if (((_a = settings === null || settings === void 0 ? void 0 : settings.updateIntervals) === null || _a === void 0 ? void 0 : _a.catalogs) || ((_b = settings === null || settings === void 0 ? void 0 : settings.updateIntervals) === null || _b === void 0 ? void 0 : _b.properties)) {
            this._debug && console.log('📣 Automatic updates enabled');
        }
        this.agencyIdPromise = (settings === null || settings === void 0 ? void 0 : settings.id) ? Promise.resolve(settings.id) : this._getDefaultAgency();
        this.agencyIdPromise.then((id) => {
            this._debug && console.log(`🏢 Agency ID: ${id}`);
        });
        this._debug && console.log('📣 Apimo API client initialized');
        this.timestamps = new Map();
        this.catalogsPromise = this._updateCatalogs();
        this.catalogsPromise.then((c) => {
            this.catalogs = c;
        });
        if ((_c = settings === null || settings === void 0 ? void 0 : settings.updateIntervals) === null || _c === void 0 ? void 0 : _c.catalogs) {
            this.catalogsInterval = setInterval(() => {
                this.catalogsPromise = this._updateCatalogs(true);
                this.catalogsPromise.then((c) => {
                    this.catalogs = c;
                });
            }, (_d = settings === null || settings === void 0 ? void 0 : settings.updateIntervals) === null || _d === void 0 ? void 0 : _d.catalogs);
        }
        if ((_e = settings === null || settings === void 0 ? void 0 : settings.updateIntervals) === null || _e === void 0 ? void 0 : _e.properties) {
            this.propertiesInterval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                this.properties = yield this.getProperties(yield this.agencyIdPromise);
            }), (_f = settings === null || settings === void 0 ? void 0 : settings.updateIntervals) === null || _f === void 0 ? void 0 : _f.properties);
        }
    }
    get(path, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = this.basePath + path.join('/');
            this._debug && console.log(`🔌 Accessing: ${url}`);
            let res;
            try {
                res = yield axios_1.default.get(url, {
                    method: 'get',
                    headers: Object.assign({ "Content-Type": "application/json" }, this._getAuthorizationHeader()),
                    data: JSON.stringify(params),
                });
            }
            catch (e) {
                if (e && typeof e === 'object' && 'message' in e) {
                    throw new Error(`⚠️ ${e.message}`);
                }
                throw new Error(`⚠️ ${e}`);
            }
            const json = res.data;
            if (json.status) {
                throw new Error(`⚠️ ${json.title} (${json.status}): ${json.message}`);
            }
            return json;
        });
    }
    getCatalogs() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = (yield this.get(['catalogs']));
            this.timestamps.set('catalogs', Date.now());
            return res;
        });
    }
    getCatalog(id, culture) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get(['catalogs', id], { culture });
        });
    }
    getAgencies() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.get(['agencies']);
            return result.agencies;
        });
    }
    getProperties(id, params) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const path = ['agencies', id !== null && id !== void 0 ? id : yield this.agencyIdPromise, 'properties'];
            yield this.catalogsPromise;
            const res = (yield this.get(path, Object.assign({ timestamp: ((_a = this.timestamps.get(path.join('/'))) !== null && _a !== void 0 ? _a : 0) }, params)));
            this.timestamps.set(path.join('/'), res.timestamp - 1);
            const properties = new Map();
            for (const property of res.properties) {
                properties.set(property.id.toString(), this._rawPropertyToProperty(property));
            }
            return properties;
        });
    }
    _getDefaultAgency() {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            const agencies = yield this.getAgencies();
            if (agencies.length === 0) {
                throw new Error('⚠️ No agencies found');
            }
            if (agencies.length > 1) {
                throw new Error(`⚠️ Multiple agencies found:\n ${agencies.map((a) => `${a.id}: ${a.name}`).join('\n')}}`);
            }
            resolve(agencies[0].id);
        }));
    }
    _updateCatalogs(forceUpdate = false) {
        if (!forceUpdate && fs.existsSync('catalogs.json')) {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                this._debug && console.log('📁 Loading catalogs from cache');
                const startTime = Date.now();
                const cacheString = fs.readFileSync('catalogs.json', 'utf8');
                let catalogCache;
                try {
                    catalogCache = JSON.parse(cacheString);
                }
                catch (e) {
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
                const result = new Map();
                let hasError = false;
                catalog: for (const catalog of cachedCatalogs) {
                    const collection = new Map();
                    const keys = Object.keys(catalogCache.catalogs[catalog]);
                    if (keys.length === 0) {
                        hasError = true;
                        break;
                    }
                    for (const key of keys) {
                        const localized = catalogCache.catalogs[catalog][key];
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
            }));
        }
        const promise = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = Date.now();
                this._debug && console.log('📁 Fetching catalogs from API');
                const catalogsList = yield this.getCatalogs();
                const catalogs = new Map();
                for (const catalog of catalogsList) {
                    const collection = new Map();
                    for (const culture of this.cultures) {
                        const entries = yield this.getCatalog(catalog.name, culture);
                        entries.forEach((entry) => {
                            if (!collection.has(String(entry.id))) {
                                collection.set(String(entry.id), {
                                    [entry.culture]: {
                                        id: entry.id,
                                        name: entry.name,
                                    },
                                });
                            }
                            else {
                                collection.get(String(entry.id))[entry.culture] = {
                                    id: entry.id,
                                    name: entry.name,
                                };
                            }
                        });
                    }
                    catalogs.set(catalog.name, collection);
                }
                const endTime = Date.now();
                this._debug && console.log('📁 Loaded catalogs from API in ' + (endTime - startTime) + 'ms');
                resolve(catalogs);
            }
            catch (e) {
                reject(e);
            }
        }));
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
            }
            catch (e) {
                console.log(e);
            }
        });
        return promise;
    }
    _getAuthorizationHeader() {
        return {
            'Authorization': `Basic ${btoa(this.provider + ':' + this.token)}`,
        };
    }
    _getLocalized(key, id) {
        if (!this.catalogs)
            throw new Error('💥 Catalogs not loaded');
        const entries = this.catalogs.get(key);
        if (!entries)
            throw new Error(`💥 Catalog \`${key}\` not found`);
        const value = entries.get(String(id));
        if (!value)
            throw new Error(`💥 Catalog \`${key}\` entry \`${id}\` not found`);
        return value;
    }
    _rawPropertyToProperty(property) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
        return Object.assign(Object.assign({}, property), { agencyId: property.agency, url: property.url, delivered_at: property.delivered_at ? new Date(property.delivered_at) : undefined, name: (_a = property.name) !== null && _a !== void 0 ? _a : '', user: [Object.assign(Object.assign({}, property.user), { id: parseInt(property.user.id), agency: parseInt(property.user.agency), city: {
                        id: parseInt((_c = (_b = property.user.city) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : '-1'),
                        name: (_e = (_d = property.user.city) === null || _d === void 0 ? void 0 : _d.name) !== null && _e !== void 0 ? _e : '',
                        zipcode: 'FIXME',
                    }, group: parseInt(property.user.group) })], city: {
                id: property.city.id,
                name: property.city.name,
                zipcode: property.city.zipcode,
            }, agreement: property.agreement ? {
                type: property.agreement.type ? this._getLocalized('property_agreement', property.agreement.type) : undefined,
                reference: (_f = property.agreement.reference) !== null && _f !== void 0 ? _f : '',
                start_at: property.agreement.start_at ? new Date(property.agreement.start_at) : undefined,
                end_at: property.agreement.end_at ? new Date(property.agreement.end_at) : undefined,
            } : undefined, step: this._getLocalized('property_step', property.step), status: this._getLocalized('property_status', property.status), parent: (_g = property.parent) !== null && _g !== void 0 ? _g : undefined, category: this._getLocalized('property_category', property.category), subcategory: property.subcategory ? this._getLocalized('property_subcategory', property.subcategory) : undefined, type: this._getLocalized('property_type', property.type), subtype: this._getLocalized('property_subtype', property.subtype), area: [
                Object.assign(Object.assign({}, property.area), { unit: this._getLocalized('unit_area', property.area.unit) })
            ], price: [
                Object.assign(Object.assign({}, property.price), { unit: property.price.unit ? this._getLocalized('unit_area', property.price.unit) : undefined, value: (_h = property.price.value) !== null && _h !== void 0 ? _h : -1, max: (_j = property.price.max) !== null && _j !== void 0 ? _j : -1, fees: (_k = property.price.fees) !== null && _k !== void 0 ? _k : -1, period: (_l = property.price.period) !== null && _l !== void 0 ? _l : -1, inventory: (_m = property.price.inventory) !== null && _m !== void 0 ? _m : -1, deposit: (_o = property.price.deposit) !== null && _o !== void 0 ? _o : -1, tenant: (_p = property.price.tenant) !== null && _p !== void 0 ? _p : -1, vat: property.price.vat || false })
            ], residence: property.residence ? [{
                    id: (_q = property.residence.id) !== null && _q !== void 0 ? _q : -1,
                    type: property.residence.type ? this._getLocalized('property_building', property.residence.type) : undefined,
                    fees: (_r = property.residence.fees) !== null && _r !== void 0 ? _r : -1,
                    period: (_s = property.residence.period) !== null && _s !== void 0 ? _s : -1,
                    lots: (_t = property.residence.lots) !== null && _t !== void 0 ? _t : -1,
                }] : [], view: property.view.type ? [
                Object.assign(Object.assign({}, property.view), { type: this._getLocalized('property_view_type', property.view.type) })
            ] : [], construction: property.construction ? {
                method: property.construction.method ? property.construction.method.map((method) => this._getLocalized('property_construction_method', method)) : [],
                construction_step: property.construction.construction_step ? this._getLocalized('construction_step', property.construction.construction_step) : undefined,
                construction_year: parseInt((_u = property.construction.construction_year) !== null && _u !== void 0 ? _u : '-1'),
                renovation_cost: (_v = property.construction.renovation_cost) !== null && _v !== void 0 ? _v : '',
                renovation_year: parseInt((_w = property.construction.renovation_year) !== null && _w !== void 0 ? _w : '-1'),
            } : undefined, floor: {
                type: property.floor.type ? this._getLocalized('property_floor', property.floor.type) : undefined,
                floors: parseInt((_x = property.floor.floors) !== null && _x !== void 0 ? _x : '-1'),
                value: (_y = property.floor.value) !== null && _y !== void 0 ? _y : -1,
                levels: parseInt((_z = property.floor.levels) !== null && _z !== void 0 ? _z : '-1'),
            }, heating: property.heating ? [{
                    device: property.heating.device ? this._getLocalized('property_heating_device', property.heating.device) : undefined,
                    access: property.heating.access ? this._getLocalized('property_heating_access', property.heating.access) : undefined,
                    type: property.heating.type ? this._getLocalized('property_heating_type', property.heating.type) : undefined,
                    types: property.heating.types ? property.heating.types.map((type) => this._getLocalized('property_heating_type', type)) : [],
                    devices: property.heating.devices ? property.heating.devices.map((device) => this._getLocalized('property_heating_device', device)) : [],
                }] : [], water: property.water ? [{
                    hot_device: property.water.hot_device ? this._getLocalized('property_hot_water_device', property.water.hot_device) : undefined,
                    hot_access: property.water.hot_access ? this._getLocalized('property_hot_water_access', property.water.hot_access) : undefined,
                    waste: property.water.waste ? this._getLocalized('property_waste_water', property.water.waste) : undefined,
                }] : [], condition: property.condition ? this._getLocalized('property_condition', property.condition) : undefined, standing: property.standing ? this._getLocalized('property_standing', property.standing) : undefined, availability: property.availability ? this._getLocalized('property_availability', property.availability) : undefined, activities: property.activities ? property.activities.map((activity) => this._getLocalized('property_activity', activity)) : [], orientations: property.orientations ? property.orientations.map((orientation) => this._getLocalized('property_orientation', orientation)) : [], services: property.services ? property.services.map((service) => this._getLocalized('property_service', service)) : [], proximities: property.proximities ? property.proximities.map((proximity) => this._getLocalized('property_proximity', proximity)) : [], tags: property.tags ? property.tags.map((tag) => this._getLocalized('tags', tag)) : [], tags_customized: [{
                    comment: 'Not implemented'
                }], pictures: property.pictures ? property.pictures.map((picture) => (Object.assign(Object.assign({}, picture), { internet: Boolean(picture.internet), print: Boolean(picture.print), panorama: Boolean(picture.panorama), child: Boolean(picture.child) }))) : [], medias: property.medias ? property.medias.map((media) => (Object.assign({}, media))) : [], documents: property.documents ? property.documents.map((document) => (Object.assign({}, document))) : [], comments: property.comments ? property.comments.map((comment) => (Object.assign({}, comment))) : [], areas: property.areas ? property.areas.map((area) => {
                var _a, _b;
                return ({
                    area: (_a = area.area) !== null && _a !== void 0 ? _a : -1,
                    type: area.type ? this._getLocalized('property_areas', area.type) : undefined,
                    flooring: area.flooring ? this._getLocalized('property_flooring', area.flooring) : undefined,
                    floor: area.floor && (area.floor.type || area.floor.value) ? [{
                            type: area.floor.type ? this._getLocalized('property_floor', area.floor.type) : undefined,
                            value: (_b = area.floor.value) !== null && _b !== void 0 ? _b : -1,
                        }] : [],
                    number: area.number
                });
            }) : [], regulations: property.regulations ? property.regulations.map((regulation) => {
                var _a;
                return (Object.assign(Object.assign({}, regulation), { type: regulation.type ? this._getLocalized('property_regulation', regulation.type) : undefined, date: new Date(regulation.date), graph: (_a = regulation.graph) !== null && _a !== void 0 ? _a : undefined }));
            }) : [], plot: Object.assign(Object.assign({}, property.plot), { net_floor: property.plot.net_floor }), created_at: new Date(property.created_at), created_by: parseInt(property.created_by), updated_at: new Date(property.updated_at), updated_by: parseInt(property.updated_by) });
    }
}
exports.default = Apimo;

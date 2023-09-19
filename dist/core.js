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
const zod_1 = require("zod");
const property_1 = require("./schemas/property");
const agency_1 = require("./schemas/agency");
const axios_1 = __importDefault(require("axios"));
const fs = __importStar(require("fs"));
class Apimo {
    constructor(provider, token, settings) {
        var _a, _b, _c;
        this.provider = provider;
        this.token = token;
        this.ready = Promise.resolve(false);
        this._debug = false;
        this._culture = 'en';
        this.catalog = {};
        this.properties = new Map();
        this._useCache = false;
        this._debug = (_a = settings === null || settings === void 0 ? void 0 : settings.debug) !== null && _a !== void 0 ? _a : false;
        this._culture = (_b = settings === null || settings === void 0 ? void 0 : settings.culture) !== null && _b !== void 0 ? _b : 'en';
        this._useCache = (_c = settings === null || settings === void 0 ? void 0 : settings.cacheRequests) !== null && _c !== void 0 ? _c : false;
        this.agencyPromise = this._getDefaultAgency(settings === null || settings === void 0 ? void 0 : settings.id);
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
    static convertDate(s) {
        const [YYYY, MM, DD] = s.split('-');
        return new Date(parseInt(YYYY), parseInt(MM) - 1, parseInt(DD));
    }
    get(path, params) {
        return __awaiter(this, void 0, void 0, function* () {
            let agency;
            if (path.includes('$agency$')) {
                agency = yield this.agencyPromise;
            }
            const url = Apimo.basePath + path.map((p) => p === '$agency$' ? agency.id : p).join('/');
            const cacheURL = this._normalizeURL(url);
            if (this._useCache && fs.existsSync(cacheURL)) {
                this.useDebug('📁 Cache hit, returning cached value: ' + cacheURL);
                const file = fs.readFileSync(cacheURL, 'utf-8');
                const obj = JSON.parse(file);
                const cacheSchema = zod_1.z.object({
                    timestamp: zod_1.z.coerce.number(),
                    value: zod_1.z.any(),
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
                res = yield axios_1.default.get(url, {
                    method: 'get',
                    headers: Object.assign({ "Content-Type": "application/json" }, this._getAuthorizationHeader()),
                    params: params,
                });
            }
            catch (e) {
                if (e instanceof Error) {
                    throw new Error(`🚨 ${e.message}`);
                }
                else {
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
                }
                catch (e) {
                    throw new Error(`🚨 Could not write cache file: ${e}`);
                }
            }
            return json;
        });
    }
    fetchCatalog() {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = Date.now();
            this.useDebug('📁 Fetching catalogs from API');
            let apimoCatalogs;
            try {
                apimoCatalogs = yield this.get(['catalogs']);
            }
            catch (e) {
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
            const result = zod_1.z.object({
                name: zod_1.z.string(),
                path: zod_1.z.string().url(),
            }).array();
            const catalogs = result.parse(apimoCatalogs);
            const catalog = {};
            for (const c of catalogs) {
                const catalogName = c.name;
                const catalogJson = yield this.get(['catalogs', catalogName]);
                const catalogResult = zod_1.z.object({
                    id: zod_1.z.coerce.number(),
                    culture: zod_1.z.string(),
                    name: zod_1.z.string(),
                    name_plural: zod_1.z.string().optional(),
                }).array();
                const catalogValues = catalogResult.parse(catalogJson).values();
                const catalogMap = {};
                for (const { id, name } of catalogValues) {
                    catalogMap[id] = name;
                }
                catalog[catalogName] = catalogMap;
            }
            const endTime = Date.now();
            this.useDebug('📁 Loaded catalogs from API in ' + (endTime - startTime) + 'ms');
            return catalog;
        });
    }
    getAgencies() {
        return __awaiter(this, void 0, void 0, function* () {
            const json = yield this.get(['agencies']);
            const result = zod_1.z.object({
                total_items: zod_1.z.number(),
                agencies: (0, agency_1.getAgencySchema)(yield this.getCatalogTransformer()).array(),
            });
            return result.parse(json).agencies;
        });
    }
    getProperties() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.get(['agencies', '$agency$', 'properties']);
            const result = zod_1.z.object({
                total_items: zod_1.z.number(),
                timestamp: zod_1.z.number(),
                processing_time: zod_1.z.number(),
                properties: (0, property_1.getPropertySchema)(yield this.getCatalogTransformer()).array(),
            }).parse(response);
            return result.properties;
        });
    }
    useDebug(...msg) {
        if (this._debug) {
            console.log(...msg);
        }
    }
    _normalizeURL(url) {
        return './cache/' + url.replace(Apimo.basePath, '').replace(/\//g, '_');
    }
    getCatalog(force = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (force) {
                this.catalogPromise = this.fetchCatalog();
                this.catalog = yield this.catalogPromise;
                yield this.saveCatalog();
                return this.catalog;
            }
            if (fs.existsSync('./cache/catalog.json')) {
                return this.parseCatalog();
            }
            return this.getCatalog(true);
        });
    }
    parseCatalog(ignoreExpiration = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const catalogString = yield new Promise((resolve, reject) => {
                fs.readFile('./cache/catalog.json', 'utf8', (err, data) => {
                    if (err)
                        return reject(err);
                    resolve(data);
                });
            });
            let catalogObject;
            try {
                catalogObject = JSON.parse(catalogString);
            }
            catch (e) {
                this.useDebug('📁 Catalog cache is invalid');
                return this.getCatalog(true);
            }
            const cacheSchema = zod_1.z.object({
                timestamp: zod_1.z.number(),
                catalog: zod_1.z.record(zod_1.z.string(), zod_1.z.record(zod_1.z.coerce.number(), zod_1.z.string())),
            });
            const cache = cacheSchema.parse(catalogObject);
            if (!ignoreExpiration && (Date.now() - cache.timestamp > 86400000)) {
                this.useDebug('📁 Catalog cache is outdated');
                return this.getCatalog(true);
            }
            this.useDebug('📁 Catalog loaded from cache');
            return cache.catalog;
        });
    }
    saveCatalog() {
        return __awaiter(this, void 0, void 0, function* () {
            const cache = JSON.stringify({
                timestamp: Date.now(),
                catalog: this.catalog,
            });
            yield new Promise((resolve, reject) => {
                fs.writeFile('catalog.json', cache, 'utf8', (err) => {
                    if (err)
                        return reject(err);
                    this.useDebug('📁 Catalog saved to cache');
                    resolve();
                });
            });
        });
    }
    _getDefaultAgency(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const agencies = yield this.getAgencies();
            if (id) {
                const agency = agencies[id];
                if (agency) {
                    return agency;
                }
                else {
                    throw new Error(`🚨 Agency ${id} not found`);
                }
            }
            if (agencies.length === 1) {
                return agencies[0];
            }
            throw new Error(`🚨 Multiple agencies found, please specify an ID: ${agencies.map(a => a.id).join(', ')}`);
        });
    }
    getCatalogTransformer() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.catalogPromise;
            return (key, value) => {
                if (!(key in this.catalog)) {
                    throw new Error(`🚨 Catalog \`${key}\` not found`);
                }
                const res = this.catalog[key][value];
                if (!res) {
                    return null;
                }
                return res.replace(/[ -]/g, '_').replace(/(«_|_»)/g, '').replace('___', '_').toLowerCase();
            };
        });
    }
    _getAuthorizationHeader() {
        return {
            'Authorization': `Basic ${btoa(this.provider + ':' + this.token)}`,
        };
    }
}
Apimo.basePath = 'https://api.apimo.pro/';
exports.default = Apimo;

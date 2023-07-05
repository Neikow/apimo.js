export type Localized = {
    [locale: string]: { id: number, name: string },
}

export interface Property {
    id: number,
    reference: number,
    agencyId: number,
    brand: unknown,
    sector: unknown,
    user: User[],
    step: Localized,
    status: Localized,
    group: number,
    parent: number | undefined,
    ranking: unknown,
    category: Localized,
    subcategory: Localized | undefined,
    name?: string,
    type: Localized,
    subtype: Localized,
    agreement: Agreement | undefined,
    block_name?: string,
    cadastre_reference?: string,
    address?: string,
    address_more?: string,
    publish_address?: boolean,
    country: string,
    region: Region,
    city: City,
    original_city?: City,
    district?: District,
    original_district?: unknown,
    location: unknown,
    longitude: number,
    latitude: number,
    radius: number,
    altitude: number,
    referral?: unknown,
    subrefferral?: unknown,
    area: SurfaceArea[],
    plot: Plot | undefined,
    rooms: number,
    bedrooms: number,
    sleeps: number,
    price: Price[],
    rates: unknown[],
    owner: unknown,
    visit: unknown,
    residence: Residence[],
    view: View[],
    construction: Construction | undefined,
    floor: Floor,
    heating: Heating[],
    water: Water[],
    condition: Localized | undefined,
    standing: Localized | undefined,
    style: Style,
    // FIXME: wtf is this?
    twinned?: string,
    facades: unknown[],
    // FIXME: wtf is this?
    length: unknown,
    // FIXME: wtf is this?
    height: unknown,
    url: string | undefined,
    availability: Localized | undefined,
    available_at: unknown,
    delivered_at: Date | undefined,
    activities: Activities,
    orientations: Orientations,
    services: Services,
    proximities: Proximities,
    tags: Tags,
    tags_customized: TagCustomized[],
    pictures: Picture[],
    medias: unknown[],
    documents: unknown[],
    comments: Comment[],
    areas: Area[],
    regulations: Regulation[],
    // FIXME: wtf is this?
    financial: unknown[],
    // FIXME: wtf is this?
    exchanges: unknown[],
    // FIXME: wtf is this?
    options: unknown[],
    // FIXME: wtf is this?
    filling_rate: unknown,
    // FIXME: wtf is this?
    private_comment: unknown,
    // FIXME: wtf is this?
    interagency_comment: unknown,
    // FIXME: wtf is this?
    status_comment: unknown,
    // FIXME: wtf is this?
    logs: unknown[],
    // FIXME: wtf is this?
    referrals: unknown[],
    created_at: Date,
    created_by: number,
    updated_at: Date,
    updated_by: number,
}

export interface Agreement {
    type: Localized | undefined,
    reference: string,
    start_at: Date | undefined,
    end_at: Date | undefined,
}

export interface Regulation {
    type: Localized | undefined,
    value: string,
    date: Date,
    graph: string | undefined
}

export interface Area {
    type: Localized | undefined,
    number: number,
    area: unknown,
    flooring: Localized | undefined,
    floor: Storey[]
}

export interface Storey {
    type: Localized | undefined,
    value: number,
}

export type Activities = Localized[];
export type Orientations = Localized[];
export type Services = Localized[];
export type Proximities = Localized[];
export type Tags = Localized[];
export type TagCustomized = {
    comment: string,
};

export interface Water {
    hot_device: Localized | undefined,
    hot_access: Localized | undefined,
    waste: Localized | undefined,
}

export interface Heating {
    device: Localized | undefined,
    devices: Localized[],
    access: Localized | undefined,
    type: Localized | undefined,
    types: Localized[],
}

export interface Floor {
    type: Localized | undefined,
    value: number,
    levels: number,
    floors: number,
}

export interface Construction {
    method: Localized[],
    construction_year: number,
    construction_step: Localized | undefined,
    renovation_year: number,
    renovation_cost: string,
}

export interface View {
    type: Localized,
    landscape: unknown,
}

export interface Residence {
    id: number,
    type: Localized | undefined,
    fees: unknown,
    period: unknown,
    lots: unknown,
}

export interface Price {
    value: number,
    max: number,
    fees: number,
    unit: unknown,
    period: unknown,
    hide: boolean,
    inventory: unknown,
    deposit: unknown,
    currency: string,
    transfer_tax: unknown,
    contribution: unknown,
    pension: unknown,
    tenant: unknown,
    vat: boolean,
}

export interface User {
    id: number,
    agency: number,
    active: boolean,
    created_at: Date,
    updated_at: Date,
    firstname: string,
    lastname: string,
    username: string,
    password: string,
    language: string,
    spoken_languages: string[],
    group: unknown,
    email: string | null,
    mobile: string,
    fax: unknown,
    city: City,
    birthday_at: Date,
    timezone: string | null,
    picture: string | null,
    partners: unknown[],
    stories: unknown[],
    rates: unknown,
}

export interface Plot {
    net_floor: string | undefined,
    land_type: unknown,
    width: unknown,
    height: unknown,
    serviced_plot: boolean,
}

export interface SurfaceArea {
    unit: Localized,
    value?: number,
    total?: number,
    weighted?: number,
}

export type CatalogsResponse = Catalog[];

export interface Catalog {
    name: string,
    path: string,
    private: boolean,
}

export type CatalogResponse = CatalogEntry[];

export interface CatalogEntry {
    id: number,
    culture: string,
    name: string,
}

export interface AgenciesResponse {
    agencies: RawAgency[];
    total_items: number;
    timestamp: number;
}

export interface RawAgency {
    id: string;
    reference: string;
    active: boolean;
    name: string;
    company: Company;
    brand: null;
    networks: any[];
    address: string;
    address_more: null;
    city: City;
    district: null;
    country: string;
    region: string;
    latitude: string;
    longitude: string;
    email: string;
    phone: string;
    fax: null;
    url: string;
    logo: string;
    logo_svg: null;
    picture: string;
    currency: string;
    timetable: string;
    created_at: Date;
    updated_at: Date;
    providers: string;
    rates: Rate[];
    partners: Partner[];
    stories: any[];
    users: RawUser[];
    sectors: any[];
    parameters: string;
    subscription: string;
}

export interface City {
    id: number;
    name: string;
    zipcode: string;
}

export interface Company {
    id: string;
    name: string;
}

export interface Partner {
    type: string;
    partner: null | string;
    name: null | string;
    reference: string;
    amount: null | string;
    currency: string;
}

export interface Rate {
    id: string;
    category: string;
    range_min: null | string;
    range_max: null | string;
    commission_price: null | string;
    commission_rate: null | string;
    comment: string;
    url: null;
}

export interface UsersResponse {
    users: RawUser[];
    total_items: number;
    timestamp: number;
}

export interface RawUser {
    id: string;
    agency: string;
    active: boolean;
    created_at: Date;
    updated_at: Date;
    firstname: string;
    lastname: string;
    username: string;
    password: string;
    language: string;
    spoken_languages: string[];
    group: string;
    email: string;
    phone: null | string;
    mobile: string;
    fax: null;
    city: Company | null;
    birthday_at: Date;
    timezone: null | string;
    picture: null | string;
    partners: any[];
    stories: any[];
    rates: null;
}

export interface PropertiesResponse {
    total_items: number
    timestamp: number
    processing_time: number
    properties: RawProperty[]
}

export interface RawProperty {
    id: number
    reference: number
    agency: number
    brand: any
    sector: any
    user: RawUser
    step: number
    status: number
    group: number
    parent?: number
    ranking: any
    category: number
    subcategory?: number
    name?: string
    type: number
    subtype: number
    agreement?: RawAgreement
    block_name?: string
    lot_reference?: string
    cadastre_reference?: string
    stairs_reference?: string
    address?: string
    address_more?: string
    publish_address: boolean
    country: string
    region: Region
    city: City
    original_city: any
    district?: District
    original_district: any
    location: any
    longitude: number
    latitude: number
    radius: number
    altitude: number
    referral: any
    subreferral: any
    area: RawSurfaceArea
    plot: RawPlot
    rooms: number
    bedrooms: number
    sleeps: number
    price: RawPrice
    rates: any[]
    owner: any
    visit: any
    residence: RawResidence
    view: RawView
    construction: RawConstruction
    floor: RawFloor
    heating: RawHeating
    water: RawWater
    condition?: number
    standing?: number
    style: Style
    twinned?: string
    facades: any
    length: any
    height: any
    url?: string
    availability?: string
    available_at: any
    delivered_at: string | undefined
    activities: any[]
    orientations: string[]
    services: number[]
    proximities: number[]
    tags: number[]
    tags_customized: any[]
    pictures: Picture[]
    medias: any[]
    documents: any[]
    comments: Comment[]
    areas: RawArea[]
    regulations: RawRegulation[]
    financial: any[]
    exchanges: any[]
    options: any[]
    filling_rate: any
    private_comment: any
    interagency_comment: any
    status_comment: any
    logs: any[]
    referrals: any[]
    created_at: string
    created_by: string
    updated_at: string
    updated_by: string
}

export interface RawAgreement {
    type: number
    reference: string
    start_at?: string
    end_at?: string
}

export interface Region {
    id: number
    name: string
}

export interface District {
    id: number
    name: string
}

export interface RawSurfaceArea {
    unit: number
    value?: number
    total?: number
    weighted?: number
}

export interface RawPlot {
    net_floor?: string
    land_type: any
    width: any
    height: any
    serviced_plot: boolean
}

export interface RawPrice {
    value?: number
    max?: number
    fees?: number
    unit: any
    period?: number
    hide: boolean
    inventory?: number
    deposit?: number
    currency: string
    commission?: number
    transfer_tax: any
    contribution: any
    pension: any
    tenant?: number
    vat?: boolean
}

export interface RawResidence {
    id?: number
    type?: number
    fees?: number
    period?: number
    lots?: number
}

export interface RawView {
    type?: number
    landscape: string[]
}

export interface RawConstruction {
    method?: string[]
    construction_year?: string
    construction_step?: string
    renovation_year?: string
    renovation_cost?: string
}

export interface RawFloor {
    type?: number
    value?: number
    levels?: string
    floors?: string
}

export interface RawHeating {
    device?: number
    devices?: string[]
    access?: number
    type?: number
    types?: string[]
}

export interface RawWater {
    hot_device?: number
    hot_access?: number
    waste?: number
}

export interface Style {
    name?: string
}

export interface Picture {
    id: number
    rank: number
    url: string
    width_max: number
    height_max: number
    internet: boolean
    print: boolean
    panorama: boolean
    child: boolean
    reference?: string
    comments: Comment[]
}

export interface Comment {
    language: string
    title?: string
    subtitle?: string
    hook: any
    comment: string
    comment_full?: string
}

export interface RawArea {
    type: number
    number: number
    area?: number
    flooring: any
    ceiling_height: any
    floor: RawStorey
    orientations: string[]
    comments: Comment[]
    lot: Lot
}

export interface RawStorey {
    type?: number
    value?: number
}

export interface Lot {
    type: any
    rank: any
    name: any[]
}

export interface RawRegulation {
    type: number
    value: string
    date: string
    graph?: string
}

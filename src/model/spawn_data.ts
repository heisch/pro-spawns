export enum Rod {
    Old = 'Old',
    Good = 'Good',
    Super = 'Super'
}

export enum WaterSpawnLocation {
    Surfing = 'Surfing',
    Fishing = 'Fishing'
}

export enum SpawnType {
    land = 'land',
    water = 'water',
    headbutt = 'headbutt'
}

export interface csv_common_spawn_data {
    [key: string]: any

    area: string
    membersAccessible: string
    region: string
    pokemon: string
    pokedexNumber: string
    membership: string
    heldItem: string
    tier: string
    levels: string
}

export interface csv_time_based_spawn_data extends csv_common_spawn_data {
    morning: boolean
    day: boolean
    night: boolean
}

export interface csv_land_spawn_data extends csv_time_based_spawn_data {

}

export interface csv_water_spawn_data extends csv_time_based_spawn_data {
    rod?: string
    location: string
}

export interface csv_headbutt_spawn_data extends csv_common_spawn_data {

}

export type CombinedCsvSpawnDataType = csv_land_spawn_data | csv_water_spawn_data | csv_headbutt_spawn_data

export interface common_spawn_data {
    [key: string]: any
    _sortArea: string
    uniqueId: string
    area: string
    membershipExclusive: boolean
    pokemon: string
    pokedexNumber: string
    heldItem: string
    tier: string
    levels: string
    min: number
    max: number
}

export interface time_based_spawn_data extends common_spawn_data {
    morning: boolean
    day: boolean
    night: boolean
}

export interface land_spawn_data extends time_based_spawn_data {

}

export interface water_spawn_data extends time_based_spawn_data {
    rod: Rod
    location: WaterSpawnLocation
}

export interface headbutt_spawn_data extends common_spawn_data {

}

export type CombinedSpawnDataType = land_spawn_data | water_spawn_data | headbutt_spawn_data;

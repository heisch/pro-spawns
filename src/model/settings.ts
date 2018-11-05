export interface DisplayInformationSettings {
    [key: string]: boolean
    id: boolean
    types: boolean
    time_of_day: boolean
    tier: boolean
    ms: boolean
    levels: boolean
    repel: boolean
    item: boolean
    ev: boolean
}

export interface Settings {
    find_pokemon_synonyms: boolean
    results_per_page: number
    display_information: DisplayInformationSettings
}

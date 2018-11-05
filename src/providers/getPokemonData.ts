export enum PokemonTypes {
    Normal = 'Normal',
    Fire = 'Fire',
    Water = 'Water',
    Electric = 'Electric',
    Grass = 'Grass',
    Ice = 'Ice',
    Fighting = 'Fighting',
    Poison = 'Poison',
    Ground = 'Ground',
    Flying = 'Flying',
    Psychic = 'Psychic',
    Bug = 'Bug',
    Rock = 'Rock',
    Ghost = 'Ghost',
    Dragon = 'Dragon',
    Dark = 'Dark',
    Steel = 'Steel',
    Fairy = 'Fairy'
}

interface CommonPokemonData {
    name: string
    types: PokemonTypes[]
    abilities: string[]
    hidden_ability?: string
    stats: number[]
    catch_rate: number
    ev_yield: number[]
    male_ratio: number | string
    height: number
    weight: number
    base_exp: number
}

export interface PokemonData extends CommonPokemonData{
    id: string
    generation: number
    species: string
    forms: PokemonFormData[]
}

export interface PokemonFormData extends CommonPokemonData{

}

export default function getPokemonData(): Array<PokemonData>  {
    return require('../resources/json/pokemon_data.json');
};

import {AnyAction} from "redux";

export enum FilterActionTypes {
    SET_FILTER_POKEMON = 'SET_FILTER_POKEMON',
    SET_FILTER_AREA = 'SET_FILTER_AREA',
}

export interface SetFilterPokemonAction extends AnyAction {
    type: FilterActionTypes.SET_FILTER_POKEMON
    pokemon: string
}

export function setFilterPokemon(pokemon: string) {
    return {type: FilterActionTypes.SET_FILTER_POKEMON, pokemon: pokemon}
}

export type FilterActions = SetFilterPokemonAction

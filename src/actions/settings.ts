import {AnyAction} from "redux";

export enum SettingsActionTypes {
    'TOGGLE_FIND_POKEMON_SYNONYMS',
    'SET_RESULTS_PER_PAGE',
    'TOGGLE_DISPLAY_INFORMATION_KEY'
}

export interface ToggleFindPokemonSynonymsAction extends AnyAction {
    type: SettingsActionTypes.TOGGLE_FIND_POKEMON_SYNONYMS
}

export interface SetResultsPerPageAction extends AnyAction {
    type: SettingsActionTypes.SET_RESULTS_PER_PAGE
    results_per_page: number
}

export interface ToggleDisplayInformationKey extends AnyAction {
    type: SettingsActionTypes.TOGGLE_DISPLAY_INFORMATION_KEY,
    key: string
}

export type SettingsAction = ToggleFindPokemonSynonymsAction | SetResultsPerPageAction | ToggleDisplayInformationKey;

export function toggleFindPokemonSynonyms(): ToggleFindPokemonSynonymsAction {
    return {type: SettingsActionTypes.TOGGLE_FIND_POKEMON_SYNONYMS};
}

export function setResultsPerPage(results_per_page: number): SetResultsPerPageAction {
    return {type: SettingsActionTypes.SET_RESULTS_PER_PAGE, results_per_page: results_per_page};
}

export function toggleDisplayInformation(key: string): ToggleDisplayInformationKey {
    return {type: SettingsActionTypes.TOGGLE_DISPLAY_INFORMATION_KEY, key: key};
}

// Define our State interface for the current reducer
import {SettingsModel} from "../model/settingsModel";
import {SettingsAction, SettingsActionTypes} from "../actions/settings";

export interface SettingsState {
    settings: SettingsModel
}

// Define our initialState
export const initialState: SettingsState = {
    settings: {
        find_pokemon_synonyms: true,
        results_per_page: 20,
        display_information: {
            id: true,
            types: true,
            time_of_day: true,
            tier: true,
            ms: true,
            levels: true,
            repel: true,
            item: true,
            ev: true
        }
    }
};

export function reducer(state: SettingsState = initialState, action: SettingsAction) {
    switch (action.type) {
        case SettingsActionTypes.TOGGLE_FIND_POKEMON_SYNONYMS:
            return {
                ...state,
                settings: {
                    ...state.settings,
                    find_pokemon_synonyms: !state.settings.find_pokemon_synonyms
                }
            };
        case SettingsActionTypes.SET_RESULTS_PER_PAGE:
            return {
                ...state,
                settings: {
                    ...state.settings,
                    results_per_page: action.results_per_page
                }
            };
        case SettingsActionTypes.TOGGLE_DISPLAY_INFORMATION_KEY:
            const display_information = state.settings.display_information;
            display_information[action.key] = !display_information[action.key];
            return {
                ...state,
                settings: {
                    ...state.settings,
                    display_information: display_information
                }
            };
        default:
            return state
    }
}

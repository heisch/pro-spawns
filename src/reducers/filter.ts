import {FilterAction, FilterActionTypes} from "../actions/filter";

export interface FilterValues {
    pokemon: string
    area: string
}

export interface FilterState {
    filter: {
        pokemon: string
        area: string
    }
}

export const initialState: FilterState = {
    filter: {
        pokemon: '',
        area: ''
    }
};

export function reducer(state: FilterState = initialState, action: FilterAction) {
    switch (action.type) {
        case FilterActionTypes.SET_FILTER_POKEMON:
            return {
                ...state,
                filter: {
                    pokemon: action.pokemon,
                    area: ''
                }
            };
        default:
            return state;
    }
}

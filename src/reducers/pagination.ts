import {PaginationAction, PaginationActionTypes} from "../actions/pagination";

export type SortByDirection = 'ascending' | 'descending' | undefined

export interface PaginationState {
    pagination: {
        page: number
        sortBy: SortByColumn
        sortByDirection: SortByDirection
    }
}

const toggleSortByDirection = (direction: SortByDirection) => direction === "ascending" ? 'descending' : 'ascending';

export const sortByColumnsSorting = {
    _sortArea: ['_sortArea', 'pokedexNumber', 'tier', 'location'],
    pokedexNumber: ['pokedexNumber', '_sortArea', 'location'],
    pokemon: ['pokemon', '_sortArea', 'location'],
    min: ['min', '_sortArea', 'location'],
    tier: ['tier', '_sortArea', 'pokedexNumber', 'location'],
    morning: ['morning', 'day', 'night', '_sortArea', 'pokedexNumber', 'location'],
    day: ['day', 'morning', 'night', '_sortArea', 'pokedexNumber', 'location'],
    night: ['night', 'morning', 'day', '_sortArea', 'pokedexNumber', 'location'],
};

export type SortByColumn = '_sortArea' | 'pokedexNumber' | 'pokemon' | 'min' | 'tier' | 'morning' | 'day' | 'night';

export const initialState: PaginationState = {
    // no need to store page for every type since we reset the page to 1 on every tab change
    pagination: {
        page: 1,
        sortBy: '_sortArea',
        sortByDirection: 'ascending'
    }
};

export function reducer(state: PaginationState = initialState, action: PaginationAction) {
    let newState: PaginationState = {
        pagination: {
            ...state.pagination
        }
    };
    switch (action.type) {
        case PaginationActionTypes.RESET_PAGE:
            newState.pagination.page = 1;
            newState.pagination.sortBy = '_sortArea';
            break;
        case PaginationActionTypes.SET_PAGE:
            newState.pagination.page = action.page;
            break;
        case PaginationActionTypes.SET_SORT_BY:
            newState.pagination.sortBy = action.sortBy;
            newState.pagination.sortByDirection = state.pagination.sortBy === action.sortBy ? toggleSortByDirection(state.pagination.sortByDirection) : "ascending";
            break;
        case PaginationActionTypes.TOGGLE_SORT_BY_DIRECTION:
            newState.pagination.sortByDirection = toggleSortByDirection(state.pagination.sortByDirection);
            break;
        default:
            return state;
    }
    return newState;
}

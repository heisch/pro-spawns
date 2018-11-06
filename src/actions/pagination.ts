import {AnyAction} from "redux";
import {SortByColumn, SortByDirection} from "../reducers/pagination";

export enum PaginationActionTypes {
    SET_PAGE = 'SET_PAGE',
    RESET_PAGE = 'RESET_PAGE',
    SET_SORT_BY = 'SET_SORT_BY',
    TOGGLE_SORT_BY_DIRECTION = 'TOGGLE_SORT_BY_DIRECTION'
}

export interface SetPageAction extends AnyAction {
    type: PaginationActionTypes.SET_PAGE
    page: number
}

export interface ResetPageAction extends AnyAction {
    type: PaginationActionTypes.RESET_PAGE
}

export interface SetSortByAction extends AnyAction {
    type: PaginationActionTypes.SET_SORT_BY
    sortBy: SortByColumn
}

export interface ToggleSortByDirectionAction extends AnyAction {
    type: PaginationActionTypes.TOGGLE_SORT_BY_DIRECTION
    direction: SortByDirection
}

export function setPage(page?: number | string): SetPageAction {
    return {type: PaginationActionTypes.SET_PAGE, page: typeof page === 'number' ? page : 1}
}

export function resetPage(): ResetPageAction {
    return {type: PaginationActionTypes.RESET_PAGE}
}

export function setSortBy(sortBy: SortByColumn): SetSortByAction {
    return {type: PaginationActionTypes.SET_SORT_BY, sortBy: sortBy}
}

export function toggleSortByDirection(direction: SortByDirection): ToggleSortByDirectionAction {
    return {type: PaginationActionTypes.TOGGLE_SORT_BY_DIRECTION, direction: direction}
}

export type PaginationAction = SetPageAction | ResetPageAction | SetSortByAction | ToggleSortByDirectionAction

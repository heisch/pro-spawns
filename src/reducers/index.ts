import {combineReducers} from 'redux'
import * as fromSettings from '../reducers/settings'
import * as fromQuickList from '../reducers/quick_list'
import * as fromFilter from '../reducers/filter'
import * as fromSpawnData from '../reducers/spawn_data'
import * as fromPagination from '../reducers/pagination'

/*
 * This is the root state of the app
 * It contains every substate of the app
 */
export interface ApplicationState {
    settings: fromSettings.SettingsState,
    quick_list: fromQuickList.QuickListState,
    filter: fromFilter.FilterState,
    spawn_data: fromSpawnData.SpawnDataState,
    pagination: fromPagination.PaginationState,
}

/*
 * initialState of the app
 */
export const initialState: ApplicationState = {
    settings: fromSettings.initialState,
    quick_list: fromQuickList.initialState,
    filter: fromFilter.initialState,
    spawn_data: fromSpawnData.initialState,
    pagination: fromPagination.initialState,
};

/*
 * Root reducer of the app
 * Returned reducer will be of type Reducer<State>
 */
export const reducer = combineReducers<ApplicationState>({
    settings: fromSettings.reducer,
    quick_list: fromQuickList.reducer,
    filter: fromFilter.reducer,
    spawn_data: fromSpawnData.reducer,
    pagination: fromPagination.reducer,
});

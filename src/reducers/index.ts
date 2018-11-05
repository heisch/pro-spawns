import {combineReducers} from 'redux'
import * as fromSettings from '../reducers/settings'
import * as fromQuickList from '../reducers/quick_list'

/*
 * This is the root state of the app
 * It contains every substate of the app
 */
export interface ApplicationState {
    settings: fromSettings.SettingsState,
    quick_list: fromQuickList.QuickListState,
}

/*
 * initialState of the app
 */
export const initialState: ApplicationState = {
    settings: fromSettings.initialState,
    quick_list: fromQuickList.initialState
};

/*
 * Root reducer of the app
 * Returned reducer will be of type Reducer<State>
 */
export const reducer = combineReducers<ApplicationState>({
    settings: fromSettings.reducer,
    quick_list: fromQuickList.reducer
});

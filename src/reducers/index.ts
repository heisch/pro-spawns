import {combineReducers} from 'redux'
import * as fromSettings from '../reducers/settings'

/*
 * This is the root state of the app
 * It contains every substate of the app
 */
export interface ApplicationState {
    settings: fromSettings.SettingsState
}

/*
 * initialState of the app
 */
export const initialState: ApplicationState = {
    settings: fromSettings.initialState
};

/*
 * Root reducer of the app
 * Returned reducer will be of type Reducer<State>
 */
export const reducer = combineReducers<ApplicationState>({
    settings: fromSettings.reducer
});

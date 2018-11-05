import {ApplicationState} from "../reducers";
import {createSelector} from "reselect";

const getSettingsState = ((state: ApplicationState) => state.settings);

/*
 * Getting todos array from todos State
 */
export const getSettings = createSelector([getSettingsState], s => s.settings);

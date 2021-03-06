import {ApplicationState} from "../reducers";
import {createSelector} from "reselect";

const getSettingsState = ((state: ApplicationState) => state.settings);

export const getSettings = createSelector([getSettingsState], s => s.settings);

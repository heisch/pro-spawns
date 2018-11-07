import {createSelector} from "reselect";
import {ApplicationState} from "../reducers";

const getFilterState = ((state: ApplicationState) => state.filter);

export const getFilter = createSelector([getFilterState], s => s.filter);

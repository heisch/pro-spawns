import {ApplicationState} from "../reducers";
import {createSelector} from "reselect";

export const getPaginationState = ((state: ApplicationState) => state.pagination);

export const getCurrentPage = createSelector([getPaginationState], s => s.pagination.page);

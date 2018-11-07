import {ApplicationState} from "../reducers";
import {createSelector} from "reselect";

const getQuickListState = ((state: ApplicationState) => state.quick_list);

export const getQuickList = createSelector([getQuickListState], s => s.quick_list);

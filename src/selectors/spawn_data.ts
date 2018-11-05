import {ApplicationState} from "../reducers";
import {createSelector} from "reselect";
import {getFilter} from "./filter";
import {SpawnSourceData} from "../providers/spawnDataParser";

export const getSpawnSourceData = ((state: ApplicationState) => state.spawn_data.sourceData);

export const getFilteredSourceData = createSelector([getSpawnSourceData, getFilter], (sourceData, filter) => {
    const filteredData: SpawnSourceData = {
        land: [],
        water: [],
        headbutt: []
    };
    filteredData.land = sourceData.land.filter(entry => entry.pokemon.toLocaleLowerCase().indexOf(filter.pokemon.toLocaleLowerCase()) > -1);
    return filteredData;
});

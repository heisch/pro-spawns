import {ApplicationState} from "../reducers";
import {createSelector} from "reselect";
import {getFilter} from "./filter";
import {SpawnSourceData} from "../providers/spawnDataParser";
import {CombinedSpawnDataType} from "../model/spawn_data";
import {getSettings} from "./settings";
import getEvolutionSynonyms from "../providers/getEvolutionSynonyms";

export const getSpawnSourceData = ((state: ApplicationState) => state.spawn_data.sourceData);

export const getFilteredSourceData = createSelector([getSpawnSourceData, getFilter, getSettings], (sourceData, filter, settings) => {
    const filteredData: SpawnSourceData = {
        land: [],
        water: [],
        headbutt: []
    };

    const evolution_synonyms = getEvolutionSynonyms();

    const filterMatchSynonym = (filter_poke: string, comparison_poke: string):boolean => {
        if (settings.find_pokemon_synonyms && evolution_synonyms.hasOwnProperty(comparison_poke)) {
            for (const synonym of evolution_synonyms[comparison_poke]) {
                if (filter_poke.length > 0 && synonym === filter_poke) {
                    return true;
                }
            }
        }
        return false;
    };

    const filterFunction = (entry: CombinedSpawnDataType) => {
        const filter_poke= filter.pokemon;
        const filter_area = filter.area;

        if (filter_poke.length > 0 || filter_area.length > 0) {
            try {
                const filter_area_regex = new RegExp(filter_area.replace('*', '.*'), 'i');
                return (filter_poke.length > 0 && (filter_poke === entry.pokemon || filterMatchSynonym(filter_poke, entry.pokemon)))
                    || (filter_area.length > 0 && entry._sortArea.match(filter_area_regex) !== null)
            } catch (e) {
                // do not throw for invalid regex
                return entry.pokemon === filter_poke;
            }
        }
        return true;
    };

    Object.keys(filteredData).forEach(type => {
        filteredData[type] = sourceData[type].filter(filterFunction)
    });

    return filteredData;
});

export const getSortedFilteredSourceData = createSelector([getFilteredSourceData], (sourceData) => {
    return sourceData; // todo: sorting
});

export const getFilteredSourceDataCount = createSelector([getFilteredSourceData], (sourceData) => {
    return sourceData.land.length + sourceData.water.length + sourceData.headbutt.length
});

export const getRepelTrickData = ((state: ApplicationState) => state.spawn_data.repelTrickData);

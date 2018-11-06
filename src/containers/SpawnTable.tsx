import React from "react";
import {connect} from "react-redux";
import {ApplicationState} from "../reducers";
import {getSettings} from "../selectors/settings";
import {getFilter} from "../selectors/filter";
import {getFilteredSourceDataCount, getRepelTrickData, getSortedFilteredSourceData} from "../selectors/spawn_data";
import {Action, Dispatch} from "redux";
import {setFilterArea, setFilterPokemon} from "../actions/filter";
import {getCurrentPage, getPaginationState} from "../selectors/pagination";
import {setPage, setSortBy} from "../actions/pagination";
import SpawnTable from '../components/SpawnTable';
import {getQuickList} from "../selectors/quick_list";
import {addToQuickList, removeFromQuickList} from "../actions/quick_list";
import {CombinedSpawnDataType} from "../model/spawn_data";
import {SortByColumn} from "../reducers/pagination";

const mapStateToProps = (state: ApplicationState) => ({
    settings: getSettings(state),
    filter: getFilter(state),
    spawnSourceData: getSortedFilteredSourceData(state),
    numberOfResults: getFilteredSourceDataCount(state),
    repelTrickData: getRepelTrickData(state),
    currentPage: getCurrentPage(state),
    paginationState: getPaginationState(state),
    quick_list: getQuickList(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Action<any>>) => ({
    setFilterPokemon: (pokemon: string) => dispatch(setFilterPokemon(pokemon)),
    setFilterArea: (area: string) => dispatch(setFilterArea(area)),
    setPage: (page?: number | string) => dispatch(setPage(page)),
    setSortBy: (sortBy: SortByColumn) => dispatch(setSortBy(sortBy)),
    addToQuickList: (entry: CombinedSpawnDataType) => dispatch(addToQuickList(entry)),
    removeFromQuickList: (pokedexNumber: string) => dispatch(removeFromQuickList(pokedexNumber)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SpawnTable);

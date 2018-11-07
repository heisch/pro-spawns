import React from "react";
import {connect} from "react-redux";
import {ApplicationState} from "../store/reducers";
import {getSettings} from "../store/selectors/settings";
import {getFilter} from "../store/selectors/filter";
import {getFilteredSourceDataCount, getRepelTrickData, getSortedFilteredSourceData} from "../store/selectors/spawn_data";
import {Action, Dispatch} from "redux";
import {setFilterArea, setFilterPokemon} from "../store/actions/filter";
import {getCurrentPage, getPaginationState} from "../store/selectors/pagination";
import {resetPage, setPage, setSortBy} from "../store/actions/pagination";
import SpawnTable from '../components/SpawnTable';
import {getQuickList} from "../store/selectors/quick_list";
import {addToQuickList, removeFromQuickList} from "../store/actions/quick_list";
import {CombinedSpawnDataType} from "../store/model/spawn_data";
import {SortByColumn} from "../store/reducers/pagination";

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
    setFilterPokemon: (pokemon: string) => {dispatch(setFilterPokemon(pokemon)); dispatch(resetPage())},
    setFilterArea: (area: string) => {dispatch(setFilterArea(area)); dispatch(resetPage())},
    setPage: (page?: number | string) => dispatch(setPage(page)),
    setSortBy: (sortBy: SortByColumn) => dispatch(setSortBy(sortBy)),
    addToQuickList: (entry: CombinedSpawnDataType) => dispatch(addToQuickList(entry)),
    removeFromQuickList: (pokedexNumber: string) => dispatch(removeFromQuickList(pokedexNumber)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SpawnTable);

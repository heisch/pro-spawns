import React from "react";
import {connect} from "react-redux";
import {ApplicationState} from "../store/reducers";
import {getFilteredSourceDataCount, getSortedFilteredSourceData} from "../store/selectors/spawn_data";
import {Action, Dispatch} from "redux";
import {resetPage} from "../store/actions/pagination";
import SpawnDataTabs from "../components/SpawnDataTabs";

const mapStateToProps = (state: ApplicationState) => ({
    spawnSourceData: getSortedFilteredSourceData(state),
    numberOfResults: getFilteredSourceDataCount(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Action<any>>) => ({
    paginationResetPage: () => dispatch(resetPage()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SpawnDataTabs)

import React from 'react';
import '../resources/css/App.css';
import '../resources/css/pokdex_sprites.css';
import '../resources/css/TypeEffectivenessMatrixModal.css';
import {ApplicationState} from "../store/reducers";
import {setFilterArea, setFilterPokemon} from "../store/actions/filter";
import {connect} from "react-redux";
import {getFilter} from "../store/selectors/filter";
import {Action, Dispatch} from "redux";
import {getSettings} from "../store/selectors/settings";
import {toggleFindPokemonSynonyms} from "../store/actions/settings";
import {getFilteredSourceDataCount} from "../store/selectors/spawn_data";
import {spawnDataParser} from "../providers/spawnDataParser";
import {SpawnType} from "../store/model/spawn_data";
import {setRepelTrickData, setSpawnDataForType} from "../store/actions/spawn_data";
import App from "../components/App";
import {resetPage} from "../store/actions/pagination";

const mapStateToProps = (state: ApplicationState) => ({
    settings: getSettings(state),
    filter: getFilter(state),
    numberOfResults: getFilteredSourceDataCount(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Action<any>>) => {
    const dataParser = new spawnDataParser();

    dataParser.getSourceData().then(results => {
        const {sourceData, repelTrickData} = results;

        dispatch(setSpawnDataForType(SpawnType.land, sourceData.land));
        dispatch(setSpawnDataForType(SpawnType.water, sourceData.water));
        dispatch(setSpawnDataForType(SpawnType.headbutt, sourceData.headbutt));
        dispatch(setRepelTrickData(repelTrickData));
    });

    return {
        toggleFindPokemonSynonyms: () => dispatch(toggleFindPokemonSynonyms()),
        setFilterPokemon: (pokemon: string) => {dispatch(setFilterPokemon(pokemon)); dispatch(resetPage())},
        setFilterArea: (area: string) => {dispatch(setFilterArea(area)); dispatch(resetPage())},
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(App)


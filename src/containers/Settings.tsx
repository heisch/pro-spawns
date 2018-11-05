import React from 'react';
import {ApplicationState} from "../reducers";
import {getSettings} from "../selectors/settings";
import {setResultsPerPage, toggleDisplayInformation, toggleFindPokemonSynonyms} from "../actions/settings";
import {connect} from "react-redux";
import SettingsModal from "../components/SettingsModal";

const mapStateToProps = (state: ApplicationState) => ({
    settings: getSettings(state)
});

const mapDispatchToProps = {
    toggleFindPokemonSynonyms: toggleFindPokemonSynonyms,
    setResultsPerPage: setResultsPerPage,
    toggleDisplayInformation: toggleDisplayInformation
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsModal)

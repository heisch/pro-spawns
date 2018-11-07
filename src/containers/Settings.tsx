import React from 'react';
import {ApplicationState} from "../store/reducers";
import {getSettings} from "../store/selectors/settings";
import {setResultsPerPage, toggleDisplayInformation} from "../store/actions/settings";
import {connect} from "react-redux";
import SettingsModal from "../components/SettingsModal";
import {Action, Dispatch} from "redux";

const mapStateToProps = (state: ApplicationState) => ({
    settings: getSettings(state)
});

const mapDispatchToProps = (dispatch: Dispatch<Action<any>>) => ({
    setResultsPerPage: (results_per_page: number) => dispatch(setResultsPerPage(results_per_page)),
    toggleDisplayInformation: (key: string) => dispatch(toggleDisplayInformation(key))
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsModal)

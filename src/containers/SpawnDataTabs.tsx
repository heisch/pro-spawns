import React from "react";
import {connect} from "react-redux";
import {ApplicationState} from "../store/reducers";
import {getFilteredSourceDataCount, getSortedFilteredSourceData} from "../store/selectors/spawn_data";
import {Action, Dispatch} from "redux";
import {SpawnSourceData} from "../providers/spawnDataParser";
import {Tab} from "semantic-ui-react";
import SpawnTable from "./SpawnTable";
import {Helpers} from "../helpers";
import {resetPage} from "../store/actions/pagination";

export interface SpawnDataTabsProps {
    spawnSourceData: SpawnSourceData
    numberOfResults: number
    paginationResetPage: () => void
}

export interface SpawnDataTabsState {

}

class SpawnDataTabs extends React.Component<SpawnDataTabsProps, SpawnDataTabsState> {

    public render() {
        if (this.props.numberOfResults === 0) return <React.Fragment>No results for current filters</React.Fragment>;

        let active_index = 0;

        const tab_panes = ['land', 'water', 'headbutt'].map((type, index) => {
            const data = this.props.spawnSourceData[type];
            if (data.length === 0 && active_index === index) active_index++;
            return {
                menuItem: Helpers.getSourceTypeLabel(type) + ` (${data.length})`,
                render: () => (
                    <Tab.Pane>
                        <SpawnTable type={type}/>
                    </Tab.Pane>
                )
            }
        });

        return <Tab panes={tab_panes} defaultActiveIndex={active_index} onTabChange={this.props.paginationResetPage}/>;

    }
}

const mapStateToProps = (state: ApplicationState) => ({
    spawnSourceData: getSortedFilteredSourceData(state),
    numberOfResults: getFilteredSourceDataCount(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Action<any>>) => ({
    paginationResetPage: () => dispatch(resetPage()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SpawnDataTabs)

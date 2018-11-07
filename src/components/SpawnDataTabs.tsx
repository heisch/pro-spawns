import React from "react";
import {SpawnSourceData} from "../providers/spawnDataParser";
import {Tab} from "semantic-ui-react";
import SpawnTable from "../containers/SpawnTable";
import {Helpers} from "../helpers";

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

export default SpawnDataTabs;

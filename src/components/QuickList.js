import React, {Component} from "react";
import PropTypes from "prop-types";
import {Button, List, Segment} from "semantic-ui-react";
import {QuickListHelpers} from "../helpers/helpers";

class QuickList extends Component {

    render() {
        const quickListData = QuickListHelpers.getQuickList();
        return (
            !quickListData ? null :
                <Segment>
                    <List horizontal >
                        {quickListData.map((entry, index) => (
                            <List.Item key={index}>
                                <Button className='btn-lnk' onClick={() => this.props.setFilter({name: entry.name, area: ''})}>
                                    <i className={`pokedex-sprite pokedex-sprite-${entry.id}`}/>
                                    {entry.name}
                                </Button>
                            </List.Item>))}
                    </List>
                </Segment>
        );
    }
}

QuickList.propTypes = {
    setFilter: PropTypes.func.isRequired
};

export default QuickList

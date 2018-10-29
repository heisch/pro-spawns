import React, {Component} from "react";
import PropTypes from "prop-types";

class Types extends Component {

    render() {
        return (
            <React.Fragment>
                {this.props.types.map((type, index) => <span key={index + type} className={'type-icon type-'+type.toLowerCase()}>{type.substr(0,3)}</span>)}
            </React.Fragment>
        );
    }
}

Types.propTypes = {
    types: PropTypes.array.isRequired,
};

Types.defaultProps = {
    displayAs: 'short'
};

export default Types

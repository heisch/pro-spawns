import React from "react";

interface TypesProps {
    types: Array<String>
}

export default class Types extends React.Component<TypesProps> {
    public render() {
        return (
            <React.Fragment>
                {this.props.types.map((type, index) =>
                    <span key={index} className={'type-icon type-'+type.toLowerCase()}>{type.substr(0,3)}</span>
                )}
            </React.Fragment>
        );
    }
}

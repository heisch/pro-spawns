import React, {Component} from "react";
import PropTypes from "prop-types";
import {Button, Grid, Modal} from "semantic-ui-react";
import '../resources/css/TypeEffectivenessMatrixModal.css';
import Types from "./Types";
import {PokemonTypes} from "../providers/getPokemonData";
import {getTypeEffectivenessChart} from "../providers/typeEffectivenessChart";

interface TypeEffectivenessMatrixModalProps {
    types: Array<PokemonTypes>
    pokemonName: string
}

interface TypeEffectivenessMatrixModalState {
    settingsModalOpen: boolean
}

class TypeEffectivenessMatrixModal extends React.Component<TypeEffectivenessMatrixModalProps, TypeEffectivenessMatrixModalState> {

    constructor(props: TypeEffectivenessMatrixModalProps) {
        super(props);
        this.state = {
            settingsModalOpen: false,
        };
    }

    getEffectivenessClassName = (effectiveness: number) => {
        switch (effectiveness) {
            case 0.25: return 'type-fx-025';
            case 0.5: return 'type-fx-050';
            default: return `type-fx-0${effectiveness}0`;
        }
    };

    renderEffectiveness = (effectiveness: number) => {
        switch (effectiveness) {
            case 0.25: return '¼';
            case 0.5: return '½';
            // case 1: return '';
            default: return effectiveness;
        }
    };

    render() {
        const modalOpen = this.state.settingsModalOpen;

        const TYPE_EFFECTIVENESS_CHART = getTypeEffectivenessChart();

        const type_effectiveness: {[index: string]: number} = {};

        Object.keys(TYPE_EFFECTIVENESS_CHART).forEach(attacking_type => {
            let effectiveness = 1;
            this.props.types.forEach(defending_type => {
                effectiveness *= TYPE_EFFECTIVENESS_CHART[attacking_type][defending_type];
            });
            type_effectiveness[attacking_type] = effectiveness;
        });

        return (
            <React.Fragment>
                <Button onClick={() => this.setState({settingsModalOpen: true})} className='btn-lnk'>
                    <Types types={this.props.types}/>
                </Button>
                <Modal size='mini' dimmer='inverted' open={modalOpen} onClose={() => this.setState({settingsModalOpen: false})} >
                    <Modal.Content className='type_effectiveness_matrix'>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column>vs {this.props.pokemonName} <Types types={this.props.types}/></Grid.Column>
                            </Grid.Row>
                        </Grid>
                        <Grid columns={9}>
                            <Grid.Row>

                                {Object.keys(type_effectiveness).slice(0,9).map(type => {
                                    return (
                                        <Grid.Column key={type} className={`type-icon type-${type.toLocaleLowerCase()}`}>
                                            {type.substr(0,3).toLocaleUpperCase()}
                                        </Grid.Column>
                                    );
                                })}

                                {Object.values(type_effectiveness).slice(0,9).map((effectiveness, index) => {
                                    return (
                                        <Grid.Column key={index} className={this.getEffectivenessClassName(effectiveness)}>
                                            {this.renderEffectiveness(effectiveness)}
                                        </Grid.Column>
                                    );
                                })}

                                {Object.keys(type_effectiveness).slice(9,18).map(type => {
                                    return (
                                        <Grid.Column key={type} className={`type-icon type-${type.toLocaleLowerCase()}`}>
                                            {type.substr(0,3).toLocaleUpperCase()}
                                        </Grid.Column>
                                    );
                                })}

                                {Object.values(type_effectiveness).slice(9,18).map((effectiveness, index) => {
                                    return (
                                        <Grid.Column key={index} className={this.getEffectivenessClassName(effectiveness)}>
                                            {this.renderEffectiveness(effectiveness)}
                                        </Grid.Column>
                                    );
                                })}


                            </Grid.Row>
                        </Grid>
                    </Modal.Content>
                </Modal>
            </React.Fragment>
        );
    }
}

export default TypeEffectivenessMatrixModal

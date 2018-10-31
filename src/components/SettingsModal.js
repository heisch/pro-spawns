import React, {Component} from "react";
import PropTypes from "prop-types";
import {Button, Checkbox, Form, Modal} from "semantic-ui-react";
import _ from "lodash";

class SettingsModal extends Component {

    constructor() {
        super();
        this.state = {
            settingsModalOpen: false,
        };
    }

    render() {
        const modalOpen = this.state.settingsModalOpen;
        const settings = this.props.settings;
        const showColumns = settings.showColumns;

        let showColumnsLabels = {
            "id": 'pokedex id',
            "types": 'pokemon types',
            "time_of_day": 'time of day',
            "tier": 'tier',
            "ms": 'membership',
            "levels": 'levels',
            "repel": 'repel trick',
            "item": 'held item',
            "ev": 'ev yield'
        };

        return (
            <React.Fragment>
                <Button icon='cog' floated='right' onClick={() => this.setState({settingsModalOpen: true})}/>
                <Modal size='mini' open={modalOpen} onClose={() => this.setState({settingsModalOpen: false})} >
                    <Modal.Header>Settings</Modal.Header>
                    <Modal.Content>
                        <Form>
                            {_.map(showColumnsLabels, (label, index) => (
                                <Form.Field key={label + index}>
                                    <Checkbox
                                        label={`show ${label} column`}
                                        toggle
                                        checked={showColumns[index]}
                                        onClick={() => this.props.setSetting(index, !showColumns[index], 'showColumns')}
                                    />
                                </Form.Field>
                            ))}

                            <Form.Field>
                                <Form.Input
                                    label={`results per page: ${settings.resultsPerPage}`}
                                    min={10}
                                    max={50}
                                    name='resultsPerPage'
                                    step={10}
                                    type='range'
                                    value={settings.resultsPerPage}
                                    onChange={(e, {value}) => this.props.setSetting('resultsPerPage', value)}
                                />
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='green' onClick={() => this.setState({settingsModalOpen: false})}>
                            Close
                        </Button>
                    </Modal.Actions>
                </Modal>
            </React.Fragment>
        );
    }
}

SettingsModal.propTypes = {
    setSetting: PropTypes.func.isRequired,
    settings: PropTypes.object.isRequired,
};

export default SettingsModal

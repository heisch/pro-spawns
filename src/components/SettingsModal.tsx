import React from "react";
import {Button, Checkbox, Form, Modal} from "semantic-ui-react";
import _ from "lodash";
import {SettingsModel} from "../store/model/settingsModel";

interface SettingsModalProps {
    settings: SettingsModel
    setResultsPerPage: (results_per_page: number) => void
    toggleDisplayInformation: (key: string) => void
}
interface State {
    settingsModalOpen: boolean
}

export default class SettingsModal extends React.Component<SettingsModalProps, State> {

    public constructor(props: SettingsModalProps) {
        super(props);
        this.state = {
            settingsModalOpen: false
        };
    }

    public render() {
        const modalOpen = this.state.settingsModalOpen;
        const settings = this.props.settings;
        const display_information = settings.display_information;

        let showColumnsLabels = {
            "id": 'pokedex id',
            "types": 'pokemon types',
            "time_of_day": 'time of day',
            "tier": 'tier',
            "ms": 'membership',
            "levels": 'levels',
            "repel": 'repel trick',
            "item": 'held item',
            "ev": 'ev yield',
            "catch_rate": 'catch rate',
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
                                        checked={display_information[index]}
                                        onClick={() => this.props.toggleDisplayInformation(index)}
                                    />
                                </Form.Field>
                            ))}

                            <Form.Field>
                                <Form.Input
                                    label={`results per page: ${settings.results_per_page}`}
                                    min={10}
                                    max={50}
                                    name='resultsPerPage'
                                    step={10}
                                    type='range'
                                    value={settings.results_per_page}
                                    onChange={(e, {value}) => this.props.setResultsPerPage(parseInt(value, 10))}
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

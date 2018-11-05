import React from 'react';
import Settings from "../containers/Settings";
import QuickList from "../containers/QuickList";
import '../resources/css/App.css';
import '../resources/css/pokdex_sprites.css';
import '../resources/css/TypeEffectivenessMatrixModal.css';
import {Checkbox, Container, Dropdown, DropdownItemProps, Form, Segment} from "semantic-ui-react";
import {ApplicationState} from "../reducers";
import {setFilterPokemon} from "../actions/filter";
import {connect} from "react-redux";
import {getFilter} from "../selectors/filter";
import {FilterValues} from "../reducers/filter";
import {defaultMemoize} from "reselect";
import getPokemonData from "../providers/getPokemonData";
import {Action, Dispatch} from "redux";
import {getSettings} from "../selectors/settings";
import {SettingsModel} from "../model/settingsModel";
import {toggleFindPokemonSynonyms} from "../actions/settings";

interface AppProps {
    filter: FilterValues,
    settings: SettingsModel,
    toggleFindPokemonSynonyms: () => void
    setFilterPokemon: (pokemon: any | string) => void
}
interface AppState {

}

class App extends React.Component<AppProps, AppState> {
    render() {
        const pokemon_dropdown_values = defaultMemoize(() => getPokemonData().map((entry): DropdownItemProps => {
            return {key: entry.name, value: entry.name, text: entry.id + ': ' + entry.name}
        }))();

        return (
            <Container>
                <Segment>
                <Settings/>
                    <Form>
                        <Dropdown
                            placeholder='pokemon name...'
                            search
                            selection
                            clearable
                            value={this.props.filter.pokemon}
                            onChange={(e, obj) => this.props.setFilterPokemon(obj.value)}
                            options={pokemon_dropdown_values}
                        />

                        &nbsp;
                        &nbsp;

                        {/*<Input*/}
                            {/*value={this.state.filter.area}*/}
                            {/*onChange={(e) => this.setFilter({area: e.target.value})}*/}
                            {/*icon={{name: 'close', link: true, onClick: () => this.setFilter({area: ''})}}*/}
                            {/*placeholder='region/area (regex)...'*/}
                        {/*/>*/}
                        {/*&nbsp;*/}
                        {/*&nbsp;*/}
                        {/*&nbsp;*/}
                        {/*<strong>{number_of_results} results</strong>*/}

                        <Form.Field>
                            <Checkbox label='Include evolutions' checked={this.props.settings.find_pokemon_synonyms}
                                      onClick={() => this.props.toggleFindPokemonSynonyms()}/>
                        </Form.Field>
                    </Form>
                </Segment>

                <QuickList/>
            </Container>
        );
    }
}

const mapStateToProps = (state: ApplicationState) => ({
    settings: getSettings(state),
    filter: getFilter(state)
});

const mapDispatchToProps = (dispatch: Dispatch<Action<any>>) => ({
    toggleFindPokemonSynonyms: () => dispatch(toggleFindPokemonSynonyms()),
    setFilterPokemon: (pokemon: string) => dispatch(setFilterPokemon(pokemon))
});

export default connect(mapStateToProps, mapDispatchToProps)(App)


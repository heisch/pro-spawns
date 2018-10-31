import React, {Component} from 'react';
import 'semantic-ui-css/semantic.min.css';
import './App.css';
import './resources/pokdex_sprites.css';
import {Checkbox, Container, Dropdown, Form, Input, Segment, Tab} from "semantic-ui-react";
import _ from 'lodash';
import {spawnDataParser} from "./helpers/spawnDataParser";
import SpawnTable from "./components/SpawnTable";
import {Helpers} from "./helpers/helpers";
import QuickList from "./components/QuickList";
import SettingsModal from "./components/SettingsModal";

class App extends Component {

    types = ['land', 'water', 'headbutt'];

    sourceData = {
        land: [],
        water: [],
        headbutt: [],
    };

    filteredData = {
        land: [],
        water: [],
        headbutt: [],
    };

    repelTrickData = {};

    sortByColumns = {
        pokedexNumber: ['pokedexNumber', '_sortArea', 'location'],
        _sortArea: ['_sortArea', 'tier', 'pokedexNumber', 'location'],
        min: ['min', '_sortArea', 'location'],
        tier: ['tier', '_sortArea', 'pokedexNumber', 'location'],
        morning: ['morning', 'day', 'night', '_sortArea', 'pokedexNumber', 'location'],
        day: ['day', 'morning', 'night', '_sortArea', 'pokedexNumber', 'location'],
        night: ['night', 'morning', 'day', '_sortArea', 'pokedexNumber', 'location'],
    };

    constructor() {
        super();

        this.evolution_synonyms = require('./resources/json/evolution_synonyms');

        this.state = {
            filter: {
                name: '',
                area: ''
            },
            sortBy: {
                column: '_sortArea',
                direction: 'ascending'
            },
            sorted: {
                land: [],
                water: [],
                headbutt: [],
            },
            settingsModalOpen: false,
            pagination: {
                land: 1,
                water: 1,
                headbutt: 1
            },
        };

        const stored_settings = localStorage.getItem('proSpawnsSettings') === null
            ? {}
            : JSON.parse(localStorage.getItem('proSpawnsSettings'));

        this.state.settings = Object.assign({}, require('./resources/json/default_settings'), stored_settings);

        this.pokemon_dropdown_values = require('./resources/json/pokemon_data')
            .map(entry => {return {key: entry.id, value: entry.name, text: entry.id + ': ' + entry.name}});

        let dataParser = new spawnDataParser();

        dataParser.getSourceData().then(results => {
            const {sourceData, repelTrickData} = results;

            this.sourceData = sourceData;
            this.repelTrickData = repelTrickData;
            this.filter();
        });
    }

    _filterMatchSynonym(name, fname) {
        let name_match = false;
        if (this.state.settings.findPokemonSynonyms && this.evolution_synonyms.hasOwnProperty(name)) {
            this.evolution_synonyms[name].forEach(synonym => {
                if (fname.length > 0 && synonym === fname) {
                    name_match = true;
                }
            })
        }
        return name_match;
    }

    filter() {
        const fname = this.state.filter.name;
        const farea = this.state.filter.area;

        if (fname.length === 0 && farea.length === 0) {
            this.filteredData = Object.assign({}, this.sourceData);
        } else {
            try {
                const fareaReg = new RegExp(farea.replace('*', '.*'), 'i');
                this.types.forEach(type => {
                    this.filteredData[type] = this.sourceData[type].filter(entry => {
                        let name_match =
                            (fname.length > 0 && entry.pokemon === fname)
                            || this._filterMatchSynonym(entry.pokemon, fname);
                        return name_match
                            || (farea.length > 0 && entry._sortArea.match(fareaReg) !== null)
                    });
                });
            } catch (e) {
                // do not throw for invalid regex
                this.filteredData = Object.assign({}, this.sourceData);
            }
        }

        // reset pagination when filters change
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.pagination = {
            land: 1,
            water: 1,
            headbutt: 1
        };
        this.sort();
    }

    sort() {
        const sorted = {};
        this.types.forEach(type => {
            if (this.state.sortBy.column) {
                sorted[type] = _.sortBy(this.filteredData[type], this.sortByColumns[this.state.sortBy.column]);
                if (this.state.sortBy.direction === 'descending') {
                    sorted['type'] = sorted[type].reverse();
                }
            } else {
                sorted[type] = this.filteredData[type];
            }
        });
        this.setState({sorted: sorted});
    }

    repelTrickPossible(type, data) {
        if (data.hasOwnProperty('location') && data.location === 'Fishing') return false;
        let repelId = type + ' - ' + data.region + ' - ' + data.area;
        if (!this.repelTrickData.hasOwnProperty(repelId)) return false;

        const areaRepelData = this.repelTrickData[repelId];

        const prominent_group_count = Math.max(...Object.values(areaRepelData));
        const prominent_group_max_level_index = Object.values(areaRepelData).indexOf(prominent_group_count);
        const prominent_group_max_level = Object.keys(areaRepelData)[prominent_group_max_level_index];

        return data.min > prominent_group_max_level;
    }

    setFilter(filter, e) {
        if (e) e.preventDefault();
        if (!filter.hasOwnProperty('name')) filter.name = this.state.filter.name;
        if (!filter.hasOwnProperty('area')) filter.area = this.state.filter.area;
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.filter = filter;
        this.filter();
    }

    sortBy(column) {
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.sortBy = {
            column: column,
            direction: this.state.sortBy.column === column ? Helpers.alternateDirection(this.state.sortBy.direction) : 'ascending'
        };
        this.filter();
    }

    paginationPageChange(activePage, type) {
        const paginationState = this.state.pagination;
        paginationState[type] = activePage;
        this.setState({pagination: paginationState});
    }

    setSetting(setting, value, group) {
        const settings = this.state.settings;
        if (group) {
            settings[group][setting] = value;
        } else {
            settings[setting] = value;
        }
        this.setState({settings: settings});
        localStorage.setItem('proSpawnsSettings', JSON.stringify(settings));
        this.filter();
    }

    forceUpdateFromSubComponent() {
        this.forceUpdate();
    }

    render() {

        const number_of_results = [].concat(...Object.values(this.state.sorted)).length;

        let active_index = 0;

        const tab_panes = this.types.map((type, index) => {
            const data = this.state.sorted[type];
            if (data.length === 0 && active_index === index) active_index++;
            return {
                menuItem: Helpers.getSourceTypeLabel(type) + ` (${data.length})`,
                render: () => (
                    <Tab.Pane>
                        <SpawnTable
                            data={data}
                            type={type}
                            repelTrickPossible={this.repelTrickPossible.bind(this)}
                            setFilter={this.setFilter.bind(this)}
                            setSortBy={this.sortBy.bind(this)}
                            forceUpdate={this.forceUpdateFromSubComponent.bind(this)}
                            paginationPageChange={this.paginationPageChange.bind(this)}
                            {...this.state}
                        />
                    </Tab.Pane>
                )
            }
        });

        return (
            <Container>
                <Segment>
                    <Form>
                        <SettingsModal
                            setSetting={this.setSetting.bind(this)}
                            {...this.state}
                        />
                        <Dropdown
                            placeholder='pokemon name...'
                            search
                            selection
                            clearable
                            value={this.state.filter.name}
                            onChange={(e, obj) => this.setFilter({name: obj.value})}
                            options={this.pokemon_dropdown_values}
                        />

                        &nbsp;
                        &nbsp;

                        <Input
                            value={this.state.filter.area}
                            onChange={(e) => this.setFilter({area: e.target.value})}
                            icon={{ name: 'close', link: true, onClick: () => this.setFilter({area: ''})}}
                            placeholder='region/area (regex)...'
                        />
                        &nbsp;
                        &nbsp;
                        &nbsp;
                        <strong>{number_of_results} results</strong>
                        <Form.Field>
                            <Checkbox label='Include evolutions' checked={this.state.settings.findPokemonSynonyms} onClick={() => this.setSetting('findPokemonSynonyms', !this.state.settings.findPokemonSynonyms)}/>
                        </Form.Field>
                    </Form>
                </Segment>

                {number_of_results === 0
                    ? <React.Fragment>No results for current filters</React.Fragment>
                    : <Tab panes={tab_panes} defaultActiveIndex={active_index} />
                }

                <QuickList setFilter={this.setFilter.bind(this)}/>
            </Container>
        );
    }
}

export default App;

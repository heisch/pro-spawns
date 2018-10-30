import React, {Component} from 'react';
import 'semantic-ui-css/semantic.min.css';
import './App.css';
import './resources/pokdex_sprites.css';
import {
    Button,
    Checkbox,
    Container,
    Dropdown,
    Form,
    Icon,
    Input,
    List,
    Modal,
    Pagination,
    Segment,
    Tab,
    Table
} from "semantic-ui-react";
import _ from 'lodash';
import Types from "./components/Types";
import {spawnDataParser} from "./helpers/spawnDataParser";

const POKEMON_DATA = require('./resources/json/pokemon_data');

class App extends Component {

    types = ['land', 'water', 'headbutt'];
    regionSorting = {
        Kanto: 1,
        Johto: 2,
        Hoenn: 3,
        Sinnoh: 4,
        Unova: 5,
        Kalos: 6,
        Alola: 7,
    };

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
            }
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

    alternateDirection(direction) {
        return direction === 'ascending' ? 'descending' : 'ascending';
    }

    sortBy(column) {
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.sortBy = {
            column: column,
            direction: this.state.sortBy.column === column ? this.alternateDirection(this.state.sortBy.direction) : 'ascending'
        };
        this.filter();
    }

    getTierClassName(rarity) {
        switch (rarity) {
            case "1":
            case "Common":
                return 'green';
            case "2":
            case "3":
                return 'olive';
            case "4":
            case "5":
            case "Intermediate":
                return 'yellow';
            case "6":
            case "7":
            case "Rare":
                return 'orange';
            case "8":
            case "9":
                return 'red';
            default:
                console.error(rarity);
                throw new Error('rarity not found');
        }
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

    getQuickList() {
        const quickListData = localStorage.getItem('proSpawnsQuickList');
        if (quickListData === null) return require('./resources/json/default_quicklist');
        return JSON.parse(quickListData);
    }

    saveQuickList(quickListData) {
        quickListData = quickListData.sort((a, b) => {
            if (a.id === b.id) return 0;
            return a.id > b.id ? 1 : -1;
        });
        localStorage.setItem('proSpawnsQuickList', JSON.stringify(quickListData));
        this.forceUpdate();
    }

    addToQuickList(id, name) {
        if (!this.inQuickList(id)) {
            const quickListData = this.getQuickList();
            quickListData.push({id: id, name: name});
            this.saveQuickList(quickListData)
        }
    }

    removeFromQuickList(id) {
        const quickListData = this.getQuickList();
        _.remove(quickListData, {id: id});
        this.saveQuickList(quickListData);
    }

    inQuickList(id) {
        return _.find(this.getQuickList(), {id: id}) !== undefined;
    }

    renderQuickList() {
        const quickListData = this.getQuickList();
        return (
            !quickListData ? null :
            <Segment>
                <List horizontal >
                    {quickListData.map((entry, index) => (
                        <List.Item key={index}>
                            <Button className='btn-lnk' onClick={() => this.setFilter({name: entry.name, area: ''})}>
                                <i className={`pokedex-sprite pokedex-sprite-${entry.id}`}/>
                                {entry.name}
                            </Button>
                        </List.Item>))}
                </List>
            </Segment>
        );
    }

    getSourceTypeLabel(type) {
        switch (type) {
            case 'headbutt':
                return 'Headbutting';
            case 'water':
                return 'Surfing and Fishing';
            default:
                return 'Walking';
        }
    }

    renderEvYield(id) {
        return _.filter(_.find(POKEMON_DATA, {id: id}).ev_yield.map((value, index) => {
            if (value === 0) return null;
            switch (index) {
                case 0: return <small key={index} className='ev_yield_hp'><strong>{value}</strong>hp</small>;
                case 1: return <small key={index} className='ev_yield_atk'><strong>{value}</strong>atk</small>;
                case 2: return <small key={index} className='ev_yield_def'><strong>{value}</strong>def</small>;
                case 3: return <small key={index} className='ev_yield_sp_atk'><strong>{value}</strong>sp.atk</small>;
                case 4: return <small key={index} className='ev_yield_sp_def'><strong>{value}</strong>sp.def</small>;
                case 5: return <small key={index} className='ev_yield_spd'><strong>{value}</strong>spd</small>;
                default: return null;
            }
        }));
    }

    renderTable(type, data) {
        if (data.length === 0) {
            return <React.Fragment>No results for {this.getSourceTypeLabel(type)}</React.Fragment>
        }

        const icon_rod = <img src="https://img.pokemondb.net/sprites/items/fishing-rod.png" alt="Fishing Rod"/>;

        const {column, direction} = this.state.sortBy;

        const showColumns = this.state.settings.showColumns;

        const numberOfColumns = 2 + Object.values(showColumns).reduce((sum, v) => sum + (v ? 1 : 0));
        const pageSize = this.state.settings.resultsPerPage;
        const currentPage = this.state.pagination[type];

        return (
            <Table key={type} compact='very' basic className={type} sortable unstackable>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell className='header-area' sorted={column === '_sortArea' ? direction : null} onClick={() => this.sortBy('_sortArea')}>
                            Region - Area
                        </Table.HeaderCell>
                        {showColumns.id && (
                            <Table.HeaderCell textAlign='right' className='header-id' sorted={column === 'pokedexNumber' ? direction : null} onClick={() => this.sortBy('pokedexNumber')}>ID</Table.HeaderCell>
                        )}
                        <Table.HeaderCell>Pokemon</Table.HeaderCell>
                        {showColumns.time_of_day && type !== 'headbutt' && (
                                <React.Fragment>
                                    <Table.HeaderCell className='header-morning' sorted={column === 'morning' ? direction : null} onClick={() => this.sortBy('morning')}>M</Table.HeaderCell>
                                    <Table.HeaderCell className='header-day' sorted={column === 'day' ? direction : null} onClick={() => this.sortBy('day')}>D</Table.HeaderCell>
                                    <Table.HeaderCell className='header-night' sorted={column === 'night' ? direction : null} onClick={() => this.sortBy('night')}>N</Table.HeaderCell>
                                </React.Fragment>
                            )}
                        {type === 'water' && <Table.HeaderCell className='header-rod'>{icon_rod}</Table.HeaderCell>}
                        {showColumns.tier && <Table.HeaderCell className='header-tier' sorted={column === 'tier' ? direction : null} onClick={() => this.sortBy('tier')}>
                            Tier
                        </Table.HeaderCell>}
                        {showColumns.ms && <Table.HeaderCell className='header-ms'>MS?</Table.HeaderCell>}
                        {showColumns.levels && <Table.HeaderCell className='header-levels' textAlign='right' sorted={column === 'min' ? direction : null} onClick={() => this.sortBy('min')}>
                            Levels
                        </Table.HeaderCell>}
                        {type !== 'headbutt' && showColumns.repel && <Table.HeaderCell className='header-repel'>Repel</Table.HeaderCell>}
                        {showColumns.item && <Table.HeaderCell className='header-item'>Item</Table.HeaderCell>}
                        {showColumns.ev && <Table.HeaderCell className='header-ev' textAlign='right'>EVs</Table.HeaderCell>}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {data
                        .slice((currentPage-1)*pageSize, currentPage*pageSize)
                        .map(entry => this.renderTableRow(entry, type))}
                </Table.Body>
                {data.length > pageSize &&
                <Table.Footer>
                    <Table.Row>
                        <Table.HeaderCell colSpan={numberOfColumns}>
                            <Pagination
                                defaultActivePage={this.state.pagination[type]}
                                totalPages={Math.ceil(data.length / pageSize)}
                                onPageChange={(e, {activePage}) => {
                                    const paginationState = this.state.pagination;
                                    paginationState[type] = activePage;
                                    this.setState({pagination: paginationState});
                                }}
                            />
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Footer>}
            </Table>
        );
    }

    renderTableRow(entry, type) {
        const showColumns = this.state.settings.showColumns;
        const repelTrickPossible = this.repelTrickPossible(type, entry);

        const icon_morning = <img src="https://img.pokemondb.net/images/locations/morning.png" alt="Morning" title="Morning"/>;
        const icon_day = <img src="https://img.pokemondb.net/images/locations/day.png" alt="Day" title="Day"/>;
        const icon_night = <img src="https://img.pokemondb.net/images/locations/night.png" alt="Night" title="Night"/>;

        const icons_rod = {
            Old: <img src="https://img.pokemondb.net/sprites/items/old-rod.png" alt="Old Rod" title="Old Rod"/>,
            Good: <img src="https://img.pokemondb.net/sprites/items/good-rod.png" alt="Good Rod" title="Good Rod"/>,
            Super: <img src="https://img.pokemondb.net/sprites/items/super-rod.png" alt="Super Rod" title="Super Rod"/>,
        };

        return (
            <Table.Row key={entry.uniqueId}>
                <Table.Cell>
                    <small>{entry.region} - </small>
                    <Button className='btn-lnk' onClick={(e) => this.setFilter({name: '', area: entry.area + '$'}, e)}>
                        {entry.area}
                    </Button>
                </Table.Cell>
                {showColumns.id && <Table.Cell textAlign='right'><small>{entry.pokedexNumber}</small></Table.Cell>}
                <Table.Cell>
                    <i className={`pokedex-sprite pokedex-sprite-${entry.pokedexNumber}`}/>
                    <Button className='btn-lnk' onClick={(e) => this.setFilter({name: entry.pokemon, area: ''}, e)}>{entry.pokemon}</Button>
                    &nbsp;
                    <a href={`https://pokemondb.net/pokedex/${entry.pokedexNumber}`} target='_blank' rel="noopener noreferrer">
                        <Icon name='external alternate'/>
                    </a>
                    &nbsp;
                    {this.inQuickList(entry.pokedexNumber)
                        ? (
                            <Button className='btn-lnk' onClick={() => this.removeFromQuickList(entry.pokedexNumber)}>
                                <i aria-hidden="true" className="bookmark green icon"/>
                            </Button>
                        ) : (
                            <Button className='btn-lnk' onClick={() => this.addToQuickList(entry.pokedexNumber, entry.pokemon)}>
                                <i aria-hidden="true" className="bookmark outline grey icon"/>
                            </Button>
                        )
                    }
                    {showColumns.types && <Types types={_.find(POKEMON_DATA, {id: entry.pokedexNumber}).types}/>}
                </Table.Cell>
                {type !== 'headbutt' && showColumns.time_of_day && (
                    <React.Fragment>
                        <Table.Cell textAlign='center' className={'row-morning ' + (entry.morning ? 'yellow' : '')}>{entry.morning ? icon_morning : null}</Table.Cell>
                        <Table.Cell textAlign='center' className={'row-day ' + (entry.day ? 'blue' : '')}>{entry.day ? icon_day : null}</Table.Cell>
                        <Table.Cell textAlign='center' className={'row-night ' + (entry.night ? 'grey' : '')}>{entry.night ? icon_night : null}</Table.Cell>
                    </React.Fragment>
                )}
                {type === 'water'
                    ? <Table.Cell className='row-rod'>{entry.rod ? icons_rod[entry.rod] : null}</Table.Cell>
                    : null}
                {showColumns.tier && <Table.Cell className={'row-tier ' + this.getTierClassName(entry.tier)} textAlign='center'>{entry.tier}</Table.Cell>}
                {showColumns.ms && (
                    <Table.Cell textAlign='center' className={entry.membership ? 'violet' : ''}>
                        {entry.membership ?
                            <i className='ui icon dollar sign white'/> : null}
                    </Table.Cell>
                )}
                {showColumns.levels && <Table.Cell textAlign='right'>{entry.levels}</Table.Cell>}
                {type !== 'headbutt' && showColumns.repel && (
                    <Table.Cell textAlign='center' className={repelTrickPossible ? 'teal' : ''}>{repelTrickPossible ? 'Yes' : null}</Table.Cell>
                )}
                {showColumns.item && <Table.Cell>{entry.heldItem}</Table.Cell>}
                {showColumns.ev && <Table.Cell className='ev_yield' textAlign='right'>{this.renderEvYield(entry.pokedexNumber)}</Table.Cell>}
            </Table.Row>
        );
    }

    renderSettingsModal() {
        const modalOpen = this.state.settingsModalOpen;
        const showColumns = this.state.settings.showColumns;

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
                                        onClick={() => this.setSetting(index, !showColumns[index], 'showColumns')}
                                    />
                                </Form.Field>
                            ))}

                            <Form.Field>
                                <Form.Input
                                    label={`results per page: ${this.state.settings.resultsPerPage}`}
                                    min={10}
                                    max={50}
                                    name='resultsPerPage'
                                    step={10}
                                    type='range'
                                    value={this.state.settings.resultsPerPage}
                                    onChange={(e, {value}) => this.setSetting('resultsPerPage', value)}
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

    render() {

        const number_of_results = [].concat(...Object.values(this.state.sorted)).length;

        let active_index = 0;

        const tab_panes = this.types.map((type, index) => {
            const data = this.state.sorted[type];
            if (data.length === 0 && active_index === index) active_index++;
            return {
                menuItem: this.getSourceTypeLabel(type) + ` (${data.length})`,
                render: () => <Tab.Pane>{this.renderTable(type, data)}</Tab.Pane>
            }
        });

        return (
            <Container>
                <Segment>
                    <Form>
                        {this.renderSettingsModal()}
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

                {this.renderQuickList()}
            </Container>
        );
    }
}

export default App;

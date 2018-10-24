import React, {Component} from 'react';
import * as Papa from 'papaparse';
import 'semantic-ui-css/semantic.min.css';
import './App.css';
import './resources/pokdex_sprites.css';
import {Button, Checkbox, Container, Dropdown, Form, Icon, Input, List, Segment, Table} from "semantic-ui-react";
import _ from 'lodash';

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
            }
        };

        this.state.settings = localStorage.getItem('proSpawnsSettings') === null
            ? require('./resources/json/default_settings')
            : JSON.parse(localStorage.getItem('proSpawnsSettings'));

        const csv_files = [
            require('./resources/csv/RawSpawnData.csv'),
            require('./resources/csv/RawWaterSpawnData.csv'),
            require('./resources/csv/HeadbuttSpawnData.csv'),
        ];

        Promise.all(csv_files.map(file => new Promise((resolve, reject) => {
            Papa.parse(file, {
                header: true,
                download: true,
                skipEmptyLines: true,
                complete: resolve,
                error: reject
            });
        }))).then(results => {

            this.sourceData = {
                land: results[0].data.map((data) => this._dataParser(data, 'land')),
                water: results[1].data.map((data) => this._dataParser(data, 'water')),
                headbutt: results[2].data.map((data) => this._dataParser(data, 'headbutt')),
            };

            this.filter();

        });
    }

    _dataParser(data, type) {
        delete data.membersAccessible;
        data.pokedexNumber = data.pokedexNumber.padStart(3, '0');
        data.membership = data.membership.length > 0;
        data.morning = !!data.morning;
        data.day = !!data.day;
        data.night = !!data.night;
        data._sortArea = this.regionSorting[data.region] + ' - ' + data.region + ' - ' + data.area;
        data.min = parseInt(!!data.levels.match(/^(\d+)-(\d+)$/) ? data.levels.replace(/^(\d+)-(\d+)$/, '$1') : data.levels, 10);
        data.max = parseInt(!!data.levels.match(/^(\d+)-(\d+)$/) ? data.levels.replace(/^(\d+)-(\d+)$/, '$2') : data.levels, 10);

        let repelId = type + ' - ' + data.region + ' - ' + data.area;

        if (typeof data.heldItem === 'string' && data.heldItem.length) {
            const regex = /(\[\[([^\]|]+)(\|[^\]]+)?]])/g;
            const tokens = data.heldItem.replace(regex, '###$1###').split('###');

            const heldItem = [];
            tokens.forEach((token, tokenIndex) => {
                if (token.match(regex)) {
                    token.replace(regex, (...matches) => {
                        heldItem.push(<a key={repelId + tokenIndex} href={`https://prowiki.info/index.php?title=Special:Search/${matches[2]}`} target="_blank" rel="noopener noreferrer">{matches[2]}</a>)
                    });
                } else {
                    heldItem.push(token);
                }
            });
            data.heldItem = heldItem;
        }

        if (!this.repelTrickData.hasOwnProperty(repelId)) {
            this.repelTrickData[repelId] = {};
        }
        if (!this.repelTrickData[repelId].hasOwnProperty(data.max)) {
            this.repelTrickData[repelId][data.max] = 0;
        }
        this.repelTrickData[repelId][data.max]++;

        return data;
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
            this.filteredData = _.cloneDeep(this.sourceData);
        }
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

    setSetting(setting, value) {
        const settings = this.state.settings;
        settings[setting] = value;
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

    renderTable(type, data) {
        if (data.length === 0) {
            return <Segment>No results for {this.getSourceTypeLabel(type)}</Segment>
        }

        const icon_morning = <img src="https://img.pokemondb.net/images/locations/morning.png" alt="Morning" title="Morning"/>;
        const icon_day = <img src="https://img.pokemondb.net/images/locations/day.png" alt="Day" title="Day"/>;
        const icon_night = <img src="https://img.pokemondb.net/images/locations/night.png" alt="Night" title="Night"/>;

        const icon_rod = <img src="https://img.pokemondb.net/sprites/items/fishing-rod.png" alt="Fishing Rod"/>;

        const icons_rod = {
            Old: <img src="https://img.pokemondb.net/sprites/items/old-rod.png" alt="Old Rod" title="Old Rod"/>,
            Good: <img src="https://img.pokemondb.net/sprites/items/good-rod.png" alt="Good Rod" title="Good Rod"/>,
            Super: <img src="https://img.pokemondb.net/sprites/items/super-rod.png" alt="Super Rod" title="Super Rod"/>,
        };

        const {column, direction} = this.state.sortBy;
        return (
            <Table key={type} compact='very' basic className={type} sortable unstackable>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell sorted={column === '_sortArea' ? direction : null} onClick={() => this.sortBy('_sortArea')}>
                            Region - Area
                        </Table.HeaderCell>
                        <Table.HeaderCell sorted={column === 'pokedexNumber' ? direction : null} onClick={() => this.sortBy('pokedexNumber')}>
                            ID
                        </Table.HeaderCell>
                        <Table.HeaderCell>Pokemon</Table.HeaderCell>
                        {type !== 'headbutt' ? (
                                <React.Fragment>
                                    <Table.HeaderCell>M</Table.HeaderCell>
                                    <Table.HeaderCell>D</Table.HeaderCell>
                                    <Table.HeaderCell>N</Table.HeaderCell>
                                </React.Fragment>
                            )
                            : null}
                        {type === 'water'
                            ? <Table.HeaderCell>{icon_rod}</Table.HeaderCell>
                            : null}
                        <Table.HeaderCell sorted={column === 'tier' ? direction : null} onClick={() => this.sortBy('tier')}>
                            Tier
                        </Table.HeaderCell>
                        <Table.HeaderCell>MS?</Table.HeaderCell>
                        <Table.HeaderCell textAlign='right' sorted={column === 'min' ? direction : null} onClick={() => this.sortBy('min')}>
                            Levels
                        </Table.HeaderCell>
                        {type !== 'headbutt' ? (
                            <Table.HeaderCell>Repel</Table.HeaderCell>
                        ) : null}
                        <Table.HeaderCell>Item</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {data.map(entry => {
                        let repelTrickPossible = this.repelTrickPossible(type, entry);
                        return (
                            <Table.Row key={JSON.stringify(entry)}>
                                <Table.Cell>
                                    <Button className='btn-lnk' onClick={(e) => this.setFilter({name: '', area: entry.area + '$'}, e)}>
                                        {entry.region} - {entry.area}
                                    </Button>
                                </Table.Cell>
                                <Table.Cell>{entry.pokedexNumber}</Table.Cell>
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
                                </Table.Cell>
                                {type !== 'headbutt' ? (
                                        <React.Fragment>
                                            <Table.Cell className={entry.morning ? 'yellow' : ''}>{entry.morning ? icon_morning : null}</Table.Cell>
                                            <Table.Cell className={entry.day ? 'blue' : ''}>{entry.day ? icon_day : null}</Table.Cell>
                                            <Table.Cell className={entry.night ? 'grey' : ''}>{entry.night ? icon_night : null}</Table.Cell>
                                        </React.Fragment>
                                    )
                                    : null}
                                {type === 'water'
                                    ? <Table.Cell>{entry.rod ? icons_rod[entry.rod] : null}</Table.Cell>
                                    : null}
                                <Table.Cell className={this.getTierClassName(entry.tier)} textAlign='center'>{entry.tier}</Table.Cell>
                                <Table.Cell textAlign='center' className={entry.membership ? 'violet' : ''}>{entry.membership ?
                                    <i className='ui icon dollar sign white'/> : null}</Table.Cell>
                                <Table.Cell textAlign='right'>{entry.levels}</Table.Cell>
                                {type !== 'headbutt' ? (
                                    <Table.Cell textAlign='center' className={repelTrickPossible ? 'teal' : ''}>{repelTrickPossible ? 'Yes' : null}</Table.Cell>
                                ) : null}
                                <Table.Cell>{entry.heldItem}</Table.Cell>
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </Table>
        );
    }

    render() {

        const number_of_results = [].concat(...Object.values(this.state.sorted)).length;

        return (
            <Container>
                <Segment>
                    <Form>
                        <Dropdown
                            placeholder='pokemon name...'
                            search
                            selection
                            clearable
                            value={this.state.filter.name}
                            onChange={(e, obj) => this.setFilter({name: obj.value})}
                            options={require('./resources/json/pokemon_names').map(name => {return {key: name, value: name, text: name}})}
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

                {number_of_results > 125
                    ? <Segment>Too many results to display</Segment>
                    : (
                        number_of_results === 0
                            ? <Segment>Please try searching for something</Segment>
                            : this.types.map(type => {
                                const data = this.state.sorted[type];
                                return this.renderTable(type, data);
                            }
                        )
                    )
                }

                {this.renderQuickList()}
            </Container>
        );
    }
}

export default App;

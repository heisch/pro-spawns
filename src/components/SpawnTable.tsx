import React from "react";
import {Button, Icon, Pagination, Table} from "semantic-ui-react";
import _ from "lodash";
import {Helpers} from "../helpers";
import {FilterValues} from "../store/reducers/filter";
import {SettingsModel} from "../store/model/settingsModel";
import {RepelTrickDataType, SpawnSourceData} from "../providers/spawnDataParser";
import {CombinedSpawnDataType} from "../store/model/spawn_data";
import {PaginationState, SortByColumn, SortByDirection} from "../store/reducers/pagination";
import {QuickListEntry} from "../store/reducers/quick_list";
import getPokemonData from "../providers/getPokemonData";
import TypeEffectivenessMatrixModal from "./TypeEffectivenessModal";

export interface SpawnTableProps {
    filter: FilterValues
    settings: SettingsModel
    spawnSourceData: SpawnSourceData
    numberOfResults: number
    type: string
    repelTrickData: RepelTrickDataType
    currentPage: number
    quick_list: QuickListEntry[]
    paginationState: PaginationState
    setFilterPokemon: (pokemon: any | string) => void
    setFilterArea: (area: any | string) => void
    setPage: (page?: number | string) => void
    setSortBy: (sortBy: SortByColumn) => void
    addToQuickList: (entry: CombinedSpawnDataType) => void
    removeFromQuickList: (pokedexNumber: string) => void
}

export default class SpawnTable extends React.Component<SpawnTableProps> {

    repelTrickPossible(type: string, entry: CombinedSpawnDataType) {
        if (entry.hasOwnProperty('location') && entry.location === 'Fishing') return false;
        let repelId = type + ' - ' + entry.region + ' - ' + entry.area;
        if (!this.props.repelTrickData.hasOwnProperty(repelId)) return false;

        const areaRepelData = this.props.repelTrickData[repelId];

        const prominent_group_count = Math.max(...Object.values(areaRepelData));
        const prominent_group_max_level_index = Object.values(areaRepelData).indexOf(prominent_group_count);
        const prominent_group_max_level = Object.keys(areaRepelData)[prominent_group_max_level_index];

        return entry.min > parseInt(prominent_group_max_level, 10);
    }

    private numberOfColumnsForType(type: string) {
        const showColumns = this.props.settings.display_information;
        let columns = 2;

        switch (type) {
            case 'water':
                columns++; // rod
            /* eslint-disable-next-line no-fallthrough */
            case 'land':
                columns += showColumns.time_of_day ? 3 : 0;
                columns += showColumns.repel ? 1 : 0;
            /* eslint-disable-next-line no-fallthrough */
            default:
                [
                    "id",
                    "tier",
                    "ms",
                    "levels",
                    "item",
                    "ev",
                ].forEach(column => {
                    columns += showColumns[column] ? 1 : 0;
                });
        }

        return columns;
    }

    private inQuickList(entry: CombinedSpawnDataType): boolean {
        return _.find(this.props.quick_list, {id: entry.pokedexNumber}) !== undefined
    }

    private static renderEvYield(entry: CombinedSpawnDataType) {
        const pokemon_data = _.find(getPokemonData(), {id: entry.pokedexNumber});
        if (pokemon_data === undefined) return null;
        return _.filter(pokemon_data.ev_yield).map((value, index) => {
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
        });
    }


    public render() {
        const type = this.props.type;
        const data = this.props.spawnSourceData[type];

        if (data.length === 0) {
            return <React.Fragment>No results for {Helpers.getSourceTypeLabel(type)}</React.Fragment>
        }

        const icon_rod = <img src="https://img.pokemondb.net/sprites/items/fishing-rod.png" alt="Fishing Rod"/>;

        const column = this.props.paginationState.pagination.sortBy;
        const direction = this.props.paginationState.pagination.sortByDirection;

        const showColumns = this.props.settings.display_information;

        const pageSize = this.props.settings.results_per_page;
        const currentPage = this.props.currentPage;

        return (
            <Table key={type} compact='very' basic className={type} sortable unstackable>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell className='header-area' sorted={column === '_sortArea' ? direction : undefined} onClick={() => this.props.setSortBy('_sortArea')}>
                            Region - Area
                        </Table.HeaderCell>
                        {showColumns.id && (
                            <Table.HeaderCell textAlign='right' className='header-id' sorted={column === 'pokedexNumber' ? direction : undefined} onClick={() => this.props.setSortBy('pokedexNumber')}>ID</Table.HeaderCell>
                        )}
                        <Table.HeaderCell sorted={column === 'pokemon' ? direction : undefined} onClick={() => this.props.setSortBy('pokemon')}>Pokemon</Table.HeaderCell>
                        {showColumns.time_of_day && type !== 'headbutt' && (
                            <React.Fragment>
                                <Table.HeaderCell className='header-morning' sorted={column === 'morning' ? direction : undefined} onClick={() => this.props.setSortBy('morning')}>M</Table.HeaderCell>
                                <Table.HeaderCell className='header-day' sorted={column === 'day' ? direction : undefined} onClick={() => this.props.setSortBy('day')}>D</Table.HeaderCell>
                                <Table.HeaderCell className='header-night' sorted={column === 'night' ? direction : undefined} onClick={() => this.props.setSortBy('night')}>N</Table.HeaderCell>
                            </React.Fragment>
                        )}
                        {type === 'water' && <Table.HeaderCell className='header-rod'>{icon_rod}</Table.HeaderCell>}
                        {showColumns.tier && <Table.HeaderCell className='header-tier' sorted={column === 'tier' ? direction : undefined} onClick={() => this.props.setSortBy('tier')}>
                            Tier
                        </Table.HeaderCell>}
                        {showColumns.ms && <Table.HeaderCell className='header-ms'>MS?</Table.HeaderCell>}
                        {showColumns.levels && <Table.HeaderCell className='header-levels' textAlign='right' sorted={column === 'min' ? direction : undefined} onClick={() => this.props.setSortBy('min')}>
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
                        <Table.HeaderCell colSpan={this.numberOfColumnsForType(type)}>
                            <Pagination
                                defaultActivePage={this.props.currentPage}
                                totalPages={Math.ceil(data.length / pageSize)}
                                onPageChange={(e, {activePage}) => {
                                    this.props.setPage(activePage);
                                }}
                            />
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Footer>}
            </Table>
        );
    }

    renderTableRow(entry: CombinedSpawnDataType, type: string) {
        const showColumns = this.props.settings.display_information;
        const repelTrickPossible = this.repelTrickPossible(type, entry);

        const pokemon_data = _.find(getPokemonData(), {id: entry.pokedexNumber});

        const icon_morning = <img src="https://img.pokemondb.net/images/locations/morning.png" alt="Morning" title="Morning"/>;
        const icon_day = <img src="https://img.pokemondb.net/images/locations/day.png" alt="Day" title="Day"/>;
        const icon_night = <img src="https://img.pokemondb.net/images/locations/night.png" alt="Night" title="Night"/>;

        const icons_rod: {[index: string]: any} = {
            Old: <img src="https://img.pokemondb.net/sprites/items/old-rod.png" alt="Old Rod" title="Old Rod"/>,
            Good: <img src="https://img.pokemondb.net/sprites/items/good-rod.png" alt="Good Rod" title="Good Rod"/>,
            Super: <img src="https://img.pokemondb.net/sprites/items/super-rod.png" alt="Super Rod" title="Super Rod"/>,
        };

        return (
            <Table.Row key={entry.uniqueId}>
                <Table.Cell>
                    <small>{entry.region} - </small>
                    <Button className='btn-lnk' onClick={() => this.props.setFilterArea(entry.area + '$')}>
                        {entry.area}
                    </Button>
                </Table.Cell>
                {showColumns.id && <Table.Cell textAlign='right'><small>{entry.pokedexNumber}</small></Table.Cell>}
                <Table.Cell>
                    <i className={`pokedex-sprite pokedex-sprite-${entry.pokedexNumber}`}/>
                    <Button className='btn-lnk' onClick={() => this.props.setFilterPokemon(entry.pokemon)}>{entry.pokemon}</Button>
                    &nbsp;
                    <a href={`https://pokemondb.net/pokedex/${entry.pokedexNumber}`} target='_blank' rel="noopener noreferrer">
                        <Icon name='external alternate'/>
                    </a>
                    &nbsp;
                    {this.inQuickList(entry)
                        ? (
                            <Button className='btn-lnk' onClick={() => this.props.removeFromQuickList(entry.pokedexNumber)}>
                                <i aria-hidden="true" className="bookmark green icon"/>
                            </Button>
                        ) : (
                            <Button className='btn-lnk' onClick={() => this.props.addToQuickList(entry)}>
                                <i aria-hidden="true" className="bookmark outline grey icon"/>
                            </Button>
                        )
                    }
                    {showColumns.types && pokemon_data && <TypeEffectivenessMatrixModal types={pokemon_data.types} pokemonName={entry.pokemon}/>}
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
                {showColumns.tier && <Table.Cell className={'row-tier ' + Helpers.getTierClassName(entry)} textAlign='center'>{entry.tier}</Table.Cell>}
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
                {showColumns.ev && <Table.Cell className='ev_yield' textAlign='right'>{SpawnTable.renderEvYield(entry)}</Table.Cell>}
            </Table.Row>
        );
    }
}

import React, {Component} from "react";
import PropTypes from "prop-types";
import {Button, Icon, Pagination, Table} from "semantic-ui-react";
import Types from "./Types";
import _ from "lodash";
import {Helpers, QuickListHelpers} from "../helpers/helpers";

const POKEMON_DATA = require('../resources/json/pokemon_data');

class SpawnTable extends Component {

    render() {
        const data = this.props.data;
        const type = this.props.type;

        if (data.length === 0) {
            return <React.Fragment>No results for {Helpers.getSourceTypeLabel(type)}</React.Fragment>
        }

        const icon_rod = <img src="https://img.pokemondb.net/sprites/items/fishing-rod.png" alt="Fishing Rod"/>;

        const {column, direction} = this.props.sortBy;

        const showColumns = this.props.settings.showColumns;

        const numberOfColumns = 2 + Object.values(showColumns).reduce((sum, v) => sum + (v ? 1 : 0));
        const pageSize = this.props.settings.resultsPerPage;
        const currentPage = this.props.pagination[type];

        return (
            <Table key={type} compact='very' basic className={type} sortable unstackable>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell className='header-area' sorted={column === '_sortArea' ? direction : null} onClick={() => this.props.setSortBy('_sortArea')}>
                            Region - Area
                        </Table.HeaderCell>
                        {showColumns.id && (
                            <Table.HeaderCell textAlign='right' className='header-id' sorted={column === 'pokedexNumber' ? direction : null} onClick={() => this.props.setSortBy('pokedexNumber')}>ID</Table.HeaderCell>
                        )}
                        <Table.HeaderCell>Pokemon</Table.HeaderCell>
                        {showColumns.time_of_day && type !== 'headbutt' && (
                            <React.Fragment>
                                <Table.HeaderCell className='header-morning' sorted={column === 'morning' ? direction : null} onClick={() => this.props.setSortBy('morning')}>M</Table.HeaderCell>
                                <Table.HeaderCell className='header-day' sorted={column === 'day' ? direction : null} onClick={() => this.props.setSortBy('day')}>D</Table.HeaderCell>
                                <Table.HeaderCell className='header-night' sorted={column === 'night' ? direction : null} onClick={() => this.props.setSortBy('night')}>N</Table.HeaderCell>
                            </React.Fragment>
                        )}
                        {type === 'water' && <Table.HeaderCell className='header-rod'>{icon_rod}</Table.HeaderCell>}
                        {showColumns.tier && <Table.HeaderCell className='header-tier' sorted={column === 'tier' ? direction : null} onClick={() => this.props.setSortBy('tier')}>
                            Tier
                        </Table.HeaderCell>}
                        {showColumns.ms && <Table.HeaderCell className='header-ms'>MS?</Table.HeaderCell>}
                        {showColumns.levels && <Table.HeaderCell className='header-levels' textAlign='right' sorted={column === 'min' ? direction : null} onClick={() => this.props.setSortBy('min')}>
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
                                defaultActivePage={this.props.pagination[type]}
                                totalPages={Math.ceil(data.length / pageSize)}
                                onPageChange={(e, {activePage}) => {
                                    this.props.paginationPageChange(activePage, type);
                                }}
                            />
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Footer>}
            </Table>
        );
    }

    renderTableRow(entry, type) {
        const showColumns = this.props.settings.showColumns;
        const repelTrickPossible = this.props.repelTrickPossible(type, entry);

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
                    <Button className='btn-lnk' onClick={(e) => this.props.setFilter({name: '', area: entry.area + '$'}, e)}>
                        {entry.area}
                    </Button>
                </Table.Cell>
                {showColumns.id && <Table.Cell textAlign='right'><small>{entry.pokedexNumber}</small></Table.Cell>}
                <Table.Cell>
                    <i className={`pokedex-sprite pokedex-sprite-${entry.pokedexNumber}`}/>
                    <Button className='btn-lnk' onClick={(e) => this.props.setFilter({name: entry.pokemon, area: ''}, e)}>{entry.pokemon}</Button>
                    &nbsp;
                    <a href={`https://pokemondb.net/pokedex/${entry.pokedexNumber}`} target='_blank' rel="noopener noreferrer">
                        <Icon name='external alternate'/>
                    </a>
                    &nbsp;
                    {QuickListHelpers.inQuickList(entry.pokedexNumber)
                        ? (
                            <Button className='btn-lnk' onClick={() => {QuickListHelpers.removeFromQuickList(entry.pokedexNumber);this.props.forceUpdate()}}>
                                <i aria-hidden="true" className="bookmark green icon"/>
                            </Button>
                        ) : (
                            <Button className='btn-lnk' onClick={() => {QuickListHelpers.addToQuickList(entry.pokedexNumber, entry.pokemon);this.props.forceUpdate()}}>
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
                {showColumns.tier && <Table.Cell className={'row-tier ' + Helpers.getTierClassName(entry.tier)} textAlign='center'>{entry.tier}</Table.Cell>}
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
                {showColumns.ev && <Table.Cell className='ev_yield' textAlign='right'>{Helpers.renderEvYield(entry.pokedexNumber)}</Table.Cell>}
            </Table.Row>
        );
    }
}

SpawnTable.propTypes = {
    data: PropTypes.array.isRequired,
    type: PropTypes.string.isRequired,
    settings: PropTypes.object.isRequired,
    repelTrickPossible: PropTypes.func.isRequired,
    setFilter: PropTypes.func.isRequired,
    sortBy: PropTypes.object.isRequired,
    setSortBy: PropTypes.func.isRequired,
    forceUpdate: PropTypes.func.isRequired,
    pagination: PropTypes.object.isRequired,
    paginationPageChange: PropTypes.func.isRequired,
};

export default SpawnTable

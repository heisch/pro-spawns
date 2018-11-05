import * as Papa from "papaparse";
import {ParseResult} from "papaparse";
import _ from "lodash";
import {
    csv_common_spawn_data,
    csv_headbutt_spawn_data,
    csv_land_spawn_data,
    csv_water_spawn_data,
    headbutt_spawn_data,
    land_spawn_data,
    SpawnType,
    water_spawn_data
} from "../model/spawn_data";

interface SpawnDataParseResult extends ParseResult {
    data: Array<csv_land_spawn_data | csv_water_spawn_data | csv_common_spawn_data>
}

type string_indexed_array = {
    [key: string]: number
}


type RepelTrickDataType = {
    [key: string]: any
}

export class spawnDataParser {

    regionSorting: string_indexed_array = {
        Kanto: 1,
        Johto: 2,
        Hoenn: 3,
        Sinnoh: 4,
        Unova: 5,
        Kalos: 6,
        Alola: 7,
    };

    repelTrickData: RepelTrickDataType = {};

    getSourceData() {
        const csv_files = [
            require('../resources/csv/RawSpawnData.csv'),
            require('../resources/csv/RawWaterSpawnData.csv'),
            require('../resources/csv/HeadbuttSpawnData.csv'),
        ];

        return new Promise((resolve) => {
            Promise.all(csv_files.map(file => new Promise<SpawnDataParseResult>((papa_resolve, papa_reject) => {
                Papa.parse(file, {
                    header: true,
                    download: true,
                    skipEmptyLines: true,
                    complete: papa_resolve,
                    error: papa_reject
                });
            }))).then((results) => {

                resolve({
                    sourceData: {
                        land: results[0].data.map((data) => this._dataParser(data, SpawnType.land)),
                        water: results[1].data.map((data) => this._dataParser(data, SpawnType.water)),
                        headbutt: results[2].data.map((data) => this._dataParser(data, SpawnType.headbutt)),
                    },
                    repelTrickData: this.repelTrickData
                });

            });
        });

    }

    _dataParser(data: csv_land_spawn_data | csv_water_spawn_data | csv_headbutt_spawn_data, type: SpawnType): land_spawn_data | water_spawn_data | headbutt_spawn_data {

        const spawnData:land_spawn_data | water_spawn_data | headbutt_spawn_data = {
            uniqueId :_.uniqueId(),
            pokemon: data.pokemon,
            pokedexNumber: data.pokedexNumber.padStart(3, '0'),
            _sortArea: this.regionSorting[data.region] + ' - ' + data.region + ' - ' + data.area,
            area: data.area,
            membershipExclusive: data.membership.length > 0 || data.membersAccessible.length > 0,
            morning: !!data.morning,
            day: !!data.day,
            night: !!data.night,
            levels: data.levels,
            tier: '',
            heldItem: '',
            min: parseInt(!!data.levels.match(/^(\d+)-(\d+)$/) ? data.levels.replace(/^(\d+)-(\d+)$/, '$1') : data.levels, 10),
            max: parseInt(!!data.levels.match(/^(\d+)-(\d+)$/) ? data.levels.replace(/^(\d+)-(\d+)$/, '$2') : data.levels, 10),
        };

        let repelId = type + ' - ' + data.region + ' - ' + data.area;

        // if (typeof data.heldItem === 'string' && data.heldItem.length) {
        //     const regex = /(\[\[([^\]|]+)(\|[^\]]+)?]])/g;
        //     const tokens = data.heldItem.replace(regex, '###$1###').split('###');
        //
        //     const heldItem = [];
        //     tokens.forEach((token, tokenIndex) => {
        //         if (token.match(regex)) {
        //             token.replace(regex, (...matches) => {
        //                 heldItem.push(<a key={repelId + tokenIndex} href={`https://prowiki.info/index.php?title=Special:Search/${matches[2]}`} target="_blank" rel="noopener noreferrer">{matches[2]}</a>)
        //             });
        //         } else {
        //             heldItem.push(token);
        //         }
        //     });
        //     data.heldItem = heldItem;
        // }

        if (type !== SpawnType.headbutt) {
            if (!this.repelTrickData.hasOwnProperty(repelId)) {
                this.repelTrickData[repelId] = {};
            }
            if (!this.repelTrickData[repelId].hasOwnProperty(data.max)) {
                this.repelTrickData[repelId][data.max] = 0;
            }
            this.repelTrickData[repelId][data.max]++;
        }

        return spawnData;
    }
}
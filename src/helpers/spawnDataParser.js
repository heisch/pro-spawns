import * as Papa from "papaparse";
import _ from "lodash";
import React from "react";

export class spawnDataParser {

    regionSorting = {
        Kanto: 1,
        Johto: 2,
        Hoenn: 3,
        Sinnoh: 4,
        Unova: 5,
        Kalos: 6,
        Alola: 7,
    };

    repelTrickData = {};

    getSourceData() {
        const csv_files = [
            require('../resources/csv/RawSpawnData.csv'),
            require('../resources/csv/RawWaterSpawnData.csv'),
            require('../resources/csv/HeadbuttSpawnData.csv'),
        ];

        return new Promise((resolve, reject) => {
            Promise.all(csv_files.map(file => new Promise((papa_resolve, papa_reject) => {
                Papa.parse(file, {
                    header: true,
                    download: true,
                    skipEmptyLines: true,
                    complete: papa_resolve,
                    error: papa_reject
                });
            }))).then(results => {

                resolve({
                    sourceData: {
                        land: results[0].data.map((data) => this._dataParser(data, 'land')),
                        water: results[1].data.map((data) => this._dataParser(data, 'water')),
                        headbutt: results[2].data.map((data) => this._dataParser(data, 'headbutt')),
                    },
                    repelTrickData: this.repelTrickData
                });

            });
        });

    }

    _dataParser(data, type) {
        data.pokedexNumber = data.pokedexNumber.padStart(3, '0');
        data.membership = data.membership.length > 0 || data.membersAccessible.length;
        data.morning = !!data.morning;
        data.day = !!data.day;
        data.night = !!data.night;
        data._sortArea = this.regionSorting[data.region] + ' - ' + data.region + ' - ' + data.area;
        data.uniqueId = _.uniqueId();
        data.min = parseInt(!!data.levels.match(/^(\d+)-(\d+)$/) ? data.levels.replace(/^(\d+)-(\d+)$/, '$1') : data.levels, 10);
        data.max = parseInt(!!data.levels.match(/^(\d+)-(\d+)$/) ? data.levels.replace(/^(\d+)-(\d+)$/, '$2') : data.levels, 10);

        delete data.membersAccessible;

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

        if (type !== 'headbutt') {
            if (!this.repelTrickData.hasOwnProperty(repelId)) {
                this.repelTrickData[repelId] = {};
            }
            if (!this.repelTrickData[repelId].hasOwnProperty(data.max)) {
                this.repelTrickData[repelId][data.max] = 0;
            }
            this.repelTrickData[repelId][data.max]++;
        }

        return data;
    }
}

import _ from "lodash";
import React from "react";

const POKEMON_DATA = require('../resources/json/pokemon_data');

export class Helpers {

    static getSourceTypeLabel(type) {
        switch (type) {
            case 'headbutt':
                return 'Headbutting';
            case 'water':
                return 'Surfing and Fishing';
            default:
                return 'Walking';
        }
    }

    static renderEvYield(id) {
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

    static alternateDirection(direction) {
        return direction === 'ascending' ? 'descending' : 'ascending';
    }

    static getTierClassName(rarity) {
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
}

export class QuickListHelpers {
    /**
     * @returns {array}
     */
    static getQuickList() {
        const quickListData = localStorage.getItem('proSpawnsQuickList');
        if (quickListData === null) return require('../resources/json/default_quicklist');
        return JSON.parse(quickListData);
    }

    static saveQuickList(quickListData) {
        quickListData = quickListData.sort((a, b) => {
            if (a.id === b.id) return 0;
            return a.id > b.id ? 1 : -1;
        });
        localStorage.setItem('proSpawnsQuickList', JSON.stringify(quickListData));
    }

    static addToQuickList(id, name) {
        if (!this.inQuickList(id)) {
            const quickListData = this.getQuickList();
            quickListData.push({id: id, name: name});
            this.saveQuickList(quickListData)
        }
    }

    static removeFromQuickList(id) {
        const quickListData = this.getQuickList();
        _.remove(quickListData, {id: id});
        this.saveQuickList(quickListData);
    }

    static inQuickList(id) {
        return _.find(this.getQuickList(), {id: id}) !== undefined;
    }
}

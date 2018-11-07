import {CombinedSpawnDataType} from "../store/model/spawn_data";

export class Helpers {
    static getSourceTypeLabel(type: string) {
        switch (type) {
            case 'headbutt':
                return 'Headbutting';
            case 'water':
                return 'Surfing and Fishing';
            default:
                return 'Walking';
        }
    }

    static alternateDirection(direction: string) {
        return direction === 'ascending' ? 'descending' : 'ascending';
    }

    static getTierClassName(entry: CombinedSpawnDataType) {
        const rarity = entry.tier;
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
                console.error(entry);
                throw new Error('rarity not found');
        }
    }
}

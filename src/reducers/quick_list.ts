import {QuickListAction, QuickListActionTypes} from "../actions/quick_list";
import _ from "lodash";

export type QuickListEntry = {
    id: string
    name: string
}

export interface QuickListState {
    quick_list: QuickListEntry[]
}

export const initialState: QuickListState = {
    quick_list: [
        {
            id: "133",
            name: "Eevee"
        },
        {
            id: "147",
            name: "Dratini"
        },
        {
            id: "175",
            name: "Togepi"
        },
        {
            id: "246",
            name: "Larvitar"
        },
        {
            id: "280",
            name: "Ralts"
        },
        {
            id: "371",
            name: "Bagon"
        },
        {
            id: "443",
            name: "Gible"
        },
        {
            id: "446",
            name: "Munchlax"
        },
        {
            id: "532",
            name: "Timburr"
        }
    ]
};

export function reducer(state: QuickListState = initialState, action: QuickListAction) {
    let newState: QuickListState = {
        quick_list: {
            ...state.quick_list
        }
    };
    switch (action.type) {
        case QuickListActionTypes.ADD_TO_LIST:
            if (_.find(state.quick_list, {id: action.entry.id}) !== undefined) {
                newState.quick_list.push({id: action.entry.pokedexNumber, name: action.entry.pokemon});
            }
            break;
        case QuickListActionTypes.REMOVE_FROM_LIST:
            newState.quick_list = state.quick_list.filter((item: QuickListEntry) => item.id !== action.pokedexNumber);
            break;
        default:
            return state;
    }
    return newState;
}

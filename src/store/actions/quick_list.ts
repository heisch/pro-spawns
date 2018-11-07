import {AnyAction} from "redux";
import {QuickListEntry} from "../reducers/quick_list";
import {CombinedSpawnDataType} from "../model/spawn_data";

export enum QuickListActionTypes {
    ADD_TO_LIST = 'ADD_TO_LIST',
    REMOVE_FROM_LIST = 'REMOVE_FROM_LIST'
}

export interface AddToListAction extends AnyAction{
    type: QuickListActionTypes.ADD_TO_LIST
    entry: CombinedSpawnDataType
}

export interface RemoveFromListAction extends AnyAction{
    type: QuickListActionTypes.REMOVE_FROM_LIST
    pokedexNumber: string
}

export function addToQuickList(entry: CombinedSpawnDataType): AddToListAction {
    return {
        type: QuickListActionTypes.ADD_TO_LIST,
        entry: entry
    };
}

export function removeFromQuickList(pokedexNumber: string): RemoveFromListAction {
    return {
        type: QuickListActionTypes.REMOVE_FROM_LIST,
        pokedexNumber: pokedexNumber
    }
}


export type QuickListAction = AddToListAction | RemoveFromListAction;

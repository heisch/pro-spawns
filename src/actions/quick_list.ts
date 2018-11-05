import {AnyAction} from "redux";
import {QuickListEntry} from "../reducers/quick_list";

export enum QuickListActionTypes {
    ADD_TO_LIST = 'ADD_TO_LIST',
    REMOVE_FROM_LIST = 'REMOVE_FROM_LIST'
}

export interface AddToListAction extends AnyAction{
    type: QuickListActionTypes.ADD_TO_LIST
    entry: QuickListEntry
}

export interface RemoveFromListAction extends AnyAction{
    type: QuickListActionTypes.REMOVE_FROM_LIST
    pokedexNumber: string
}


export type QuickListAction = AddToListAction | RemoveFromListAction;

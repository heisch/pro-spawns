import {AnyAction} from "redux";
import {CombinedSpawnDataType, SpawnType} from "../model/spawn_data";
import {RepelTrickDataType} from "../providers/spawnDataParser";

export enum SpawnDataActionTypes {
    SET_DATA_FOR_TYPE = 'SET_DATA_FOR_TYPE',
    SET_REPEL_TRICK_DATA = 'SET_REPEL_TRICK_DATA',
}

export interface SetSpawnDataForTypeAction extends AnyAction {
    type: SpawnDataActionTypes.SET_DATA_FOR_TYPE
    payload: {
        type: SpawnType
        data: CombinedSpawnDataType[]
    }
}

export interface SetRepelTrickDataAction extends AnyAction {
    type: SpawnDataActionTypes.SET_REPEL_TRICK_DATA
    data: RepelTrickDataType
}

export type SpawnDataAction = SetSpawnDataForTypeAction | SetRepelTrickDataAction;

export function setSpawnDataForType(type: SpawnType, data: CombinedSpawnDataType[]): SetSpawnDataForTypeAction {
    return {
        type: SpawnDataActionTypes.SET_DATA_FOR_TYPE,
        payload: {
            type: type,
            data: data
        }
    }
}

export function setRepelTrickData(data: RepelTrickDataType): SetRepelTrickDataAction {
    return {
        type: SpawnDataActionTypes.SET_REPEL_TRICK_DATA,
        data: data
    }
}

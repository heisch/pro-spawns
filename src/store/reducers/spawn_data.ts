import {RepelTrickDataType, SpawnSourceData} from "../../providers/spawnDataParser";
import {SpawnType} from "../model/spawn_data";
import {SpawnDataAction, SpawnDataActionTypes} from "../actions/spawn_data";

export interface SpawnDataState {
    sourceData: SpawnSourceData
    repelTrickData: RepelTrickDataType
}

export const initialState: SpawnDataState = {
    sourceData: {
        land: [],
        water: [],
        headbutt: []
    },
    repelTrickData: {}
};

export function reducer(state: SpawnDataState = initialState, action: SpawnDataAction) {
    switch (action.type) {
        case SpawnDataActionTypes.SET_DATA_FOR_TYPE:
            return {
                ...state,
                sourceData: {
                    land: action.payload.type === SpawnType.land ? action.payload.data : state.sourceData.land,
                    water: action.payload.type === SpawnType.water ? action.payload.data : state.sourceData.water,
                    headbutt: action.payload.type === SpawnType.headbutt ? action.payload.data : state.sourceData.headbutt,
                }
            };
        case SpawnDataActionTypes.SET_REPEL_TRICK_DATA:
            return {
                ...state,
                repelTrickData: action.data
            };
        default: return state;
    }
}

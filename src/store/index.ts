import logger from 'redux-logger';
import {applyMiddleware, createStore} from 'redux'
import {initialState, reducer} from '../reducers'
import {persistReducer, persistStore} from 'redux-persist'
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";

const persistConfig = {
    key: 'root',
    storage: storage,
    whitelist: ['settings', 'quick_list'],
    stateReconciler: autoMergeLevel2
};

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = createStore(persistedReducer, initialState, applyMiddleware(logger));
export const persistor = persistStore(store);

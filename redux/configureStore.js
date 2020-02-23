import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { campsites } from './campsites';
import { comments } from './comments';
import { promotions } from './promotions';
import { partners } from './partners';
import { favorites } from './favorites';
// for persistant storage support
import { persistStore, persistCombineReducers } from 'redux-persist';
// gives access to local storage on the device and appropriate storage support
import storage from 'redux-persist/es/storage';

// persistant storage config
const config = {
    key: 'root',
    storage,
    debug: true // send error messages to console.log
}

export const ConfigureStore = () => {
    const store = createStore(
        // handles updating the state to local storage
        persistCombineReducers(config, {
            campsites,
            comments,
            partners,
            promotions,
            favorites
        }),
        applyMiddleware(thunk, logger)
    );

    // enables the store to be persisted
    // we will use this later in App.js
    const persistor = persistStore(store);

    return { persistor, store };
};
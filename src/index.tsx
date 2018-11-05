import 'semantic-ui-css/semantic.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {Provider} from "react-redux";
import {persistor, store} from "./store";
import {PersistGate} from "redux-persist/integration/react";
import logo from './logo.svg';
import './css/index.css';
import Settings from "./containers/Settings";


ReactDOM.render(
    <Provider store={store}>
        <PersistGate persistor={persistor} loading={<img src={logo} className="App-logo" alt="logo"/>}>
            <App/>
            <Settings/>
        </PersistGate>
    </Provider>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

import React from 'react';
import ReactDOM from 'react-dom';
import IRouter from './router';
import './index.css';
import * as serviceWorker from './serviceWorker';
import {Provider} from "react-redux";
import configureStore from "./redux/store/configureStore";
import storageUtils from './uitils/storageUtils';
import memoryUtils from './uitils/memoryUtils';
const store = configureStore();
const user = storageUtils.getUser();
memoryUtils.user = user;
ReactDOM.render(<Provider store={store}>
                    <IRouter />
                </Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

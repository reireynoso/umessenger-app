import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'
import {createStore, applyMiddleware, compose} from 'redux'
import rootReducer from './reducers'
import App from './App';
import * as serviceWorker from './serviceWorker';

// adds trace capability to redux devtools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
  trace: true,
  traceLimit: 25
}) : compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
)
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

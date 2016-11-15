import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import _ from 'lodash';
import QueryString from 'query-string';
import './index.css';

// Initial Action we will dispatch if we either already have an access token,
// or if we were called with a new access token in the fragment (hash)
import { initializeFromApi } from './actions';

// Import the reducer factories
import { createNotesReducer, createNotesIndexReducer } from './reducers/notesReducers';
import { createActiveIdReducer } from './reducers/activeIdReducer';
import { createUserReducer } from './reducers/userReducer';
import { createViewReducer } from './reducers/viewReducer';

const authServerData = [];

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const API_NAME = 'api/markdown-notes';
let AUTH_SERVER_SOCIAL = process.env.REACT_APP_AUTH_SERVER_SOCIAL;
if (!AUTH_SERVER_SOCIAL.endsWith('/'))
  AUTH_SERVER_SOCIAL += '/';

if (process.env.REACT_APP_AUTH_SERVER_GITHUB) {
  authServerData.push({
    name: "GitHub",
    url: AUTH_SERVER_SOCIAL + 'github/' + API_NAME + '?client_id=' + CLIENT_ID,
    profileUrl: AUTH_SERVER_SOCIAL + 'profile',
    bsStyle: "default"
  });
}
if (process.env.REACT_APP_AUTH_SERVER_GOOGLE) {
  authServerData.push({
    name: "Google",
    url: AUTH_SERVER_SOCIAL + 'google/' + API_NAME + '?client_id=' + CLIENT_ID,
    profileUrl: AUTH_SERVER_SOCIAL + 'profile',
    bsStyle: "danger"
  });
}

if (process.env.REACT_APP_AUTH_SERVER_SAML) {
  const samlServerUrl = process.env.REACT_APP_AUTH_SERVER_SAML;
  authServerData.push({
    name: "Atlantic SAML",
    url: samlServerUrl + API_NAME + '?client_id=' + CLIENT_ID,
    profileUrl: samlServerUrl + 'profile',
    bsStyle: "primary"
  });
}

const getAccessToken = (hash) => {
  if (!hash)
    return null;
  if (!hash.startsWith('#'))
    return null;
  const parsedHash = QueryString.parse(hash);
  if (!parsedHash.access_token)
    return null;
  return parsedHash.access_token;
};

let accessToken = getAccessToken(window.location.hash);
if (!accessToken)
  accessToken = window.localStorage.getItem('access_token');

const loggedIn = !!accessToken;
// Remove the access token from the fragment immediately. Doesn't look nice.
window.location.hash = '';
if (accessToken)
  window.localStorage.setItem('access_token', accessToken);

console.log('accessToken: ' + accessToken);
console.log('loggedIn: ' + loggedIn);

// Create reducers
const user = createUserReducer(loggedIn, accessToken);
const view = createViewReducer();
const notesIndex = createNotesIndexReducer();
const notes = createNotesReducer();
const activeId = createActiveIdReducer();
const authServers = (state = authServerData, action) => {
  // Immutable, but good to have in state
  return state;
};

const notesApp = combineReducers({
  user,
  view,
  notesIndex,
  notes,
  activeId,
  authServers
});

let store = createStore(notesApp, applyMiddleware(ReduxThunk));
window.store = store;

if (loggedIn) {
  // Try to make an initial state now that we think we're logged in.
  store.dispatch(initializeFromApi());
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

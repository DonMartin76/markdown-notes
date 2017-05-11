import 'whatwg-fetch'; // fetch polyfill

let BASE_URL = null; //'https://api.donmartin76.com/markdown-notes/v1/';
const API_PATH = '/markdown-notes/v1/';
// if (process.env.REACT_APP_API_URL) {
//     BASE_URL = process.env.REACT_APP_API_URL;
//     if (!BASE_URL.endsWith('/'))
//         BASE_URL += '/';
// }

//const TEST_HEADERS = {
//    'X-Authenticated-UserId': 'google:1234567',
//    'Authorization': 'Basic dXNlcm5hbWU6cGFzc3dvcmQ='
//};
//const TEST_PUT_HEADERS = Object.assign({}, TEST_HEADERS, { 'Content-Type': 'application/json' });

function getHeaders(state) {
    //return TEST_HEADERS;
    const h = {
        'Authorization': 'Bearer ' + state.user.accessToken
    };
    return h;
}

function getPutHeaders(state) {
    const h = getHeaders(state);
    h['Content-Type'] = 'application/json';
    return h;
    //return TEST_PUT_HEADERS;
}

const api = function () {};

const checkStatus = (response) => {
    if (response.status >= 200 && response.status < 300)
        return response;
    const err = new Error(response.statusText);
    console.log(response);
    err.response = response;
    err.status = response.status; // for convenience
    throw err;
};

const parseJson = (response) => {
    return response.json();
};

const rememberApiUrl = (response) => {
    BASE_URL = 'https://' + response.apiGateway + API_PATH;
    console.log('Setting API Gateway: ' + BASE_URL);
    return response;
};

// These all return Promises. I promise.
api.get = (state, url) => {
    return fetch(BASE_URL + url, {
        method: 'GET',
        headers: getHeaders(state)
    })
        .then(checkStatus)
        .then(parseJson);
};

api.loadSettings = () => {
    console.log("LOADING SETTINGS");
    return fetch('/settings.json', {
        method: 'GET'
    })
        .then(checkStatus)
        .then(parseJson)
        .then(rememberApiUrl);
};

api.put = (state, url, content) => {
    return fetch(BASE_URL + url, {
        method: 'PUT',
        body: JSON.stringify(content),
        headers: getPutHeaders(state)
    })
        .then(checkStatus)
        .then(parseJson);
};

api.delete = (state, url) => {
    return fetch(BASE_URL + url, {
        method: 'DELETE',
        headers: getHeaders(state)
    }).then(checkStatus);
};

// Convenience functionality.
api.getMe = (state) => {
    return api.get(state, 'users/me');
};

api.getUser = (state, id) => {
    return api.get(state, 'users/' + id);
};

api.putUser = (state, user) => {
    return api.put(state, 'users/' + user.id, user);
};

api.getUserIndex = (state, id) => {
    return api.get(state, 'users/' + id + '/index');
};

api.putNote = (state, note) => {
    return api.put(state, 'notes/' + note.id, note);
};

api.getNote = (state, id) => {
    return api.get(state, 'notes/' + id);
};

api.deleteNote = (state, id) => {
    return api.delete(state, 'notes/' + id);
};

api.getProfile = (state) => {
    // This goes to the Authorization Server, not to the API.
    const profileUrl = window.localStorage.getItem("profileUrl");
    return fetch(profileUrl, { credentials: "include" })
        .then(checkStatus)
        .then(parseJson);
};

export default api;
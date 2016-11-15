'use strict';

const basicAuth = require('basic-auth');
const debug = require('debug')('markdown-notes-api:api-auth');

let USERNAME = 'username';
let PASSWORD = 'password';

if (process.env.API_USERNAME) {
    console.log('Picking up username from API_USERNAME.');
    USERNAME = process.env.API_USERNAME;
} else {
    console.error('WARNING: Environment variable API_USERNAME not set, defaults to "' + USERNAME + '".');
}
if (process.env.API_PASSWORD) {
    console.log('Picking up password from API_PASSWORD.');
    PASSWORD = process.env.API_PASSWORD;
} else {
    console.error('WARNING: Environment variable API_PASSWORD not set, defaults to "' + PASSWORD + '".');
}

const apiAuth = (req, res, next) => {
    debug('authorize()');

    const unauthorized = (res) => {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return res.sendStatus(401);
    };

    const user = basicAuth(req);
    debug(user);

    if (!user || !user.name || !user.pass) {
        debug('user object not valid (missing username or password)');
        return unauthorized(res);
    }
    if (user.name !== USERNAME || user.pass !== PASSWORD) {
        debug('wrong credentials');
        return unauthorized(res);
    }

    debug('valid credentials detected, continuing.');
    next();
};

module.exports = apiAuth;

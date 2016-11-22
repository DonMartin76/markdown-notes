'use strict';

const debug = require('debug')('markdown-notes-api:user-mapper');
const db = require('./db');

/*
 The user mapper maps the external (authenticated) user id to an internal ID via
 SHA256 hashing. If we arrive here, we know that we have already passed through
 the basic auth authentication, and thus we should have an X-Authenticated-Userid
 header from our API Gateway.
 */

const userMapper = (req, res, next) => {
    const externalId = req.headers['x-authenticated-userid'];
    if (!externalId)
        return res.status(400).json({ message: 'Bad request, missing X-Authenticated-Userid header.' });
    debug('X-Authenticated-Userid: ' + externalId);
    db.findOrCreateUser(externalId, function (err, userData) {
        if (err)
            return next(err);
        // Attach user info to request
        req.user = userData;
        next();
    });
};

module.exports = userMapper;

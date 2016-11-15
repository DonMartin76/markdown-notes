'use strict';

const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const apiAuth = require('./routes/api-auth');
const userMapper = require('./routes/user-mapper');
const users = require('./routes/users');
const notes = require('./routes/notes');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let basePath = '/';
if (process.env.API_BASE_PATH) {
  basePath = process.env.API_BASE_PATH;
  if (!basePath.startsWith('/'))
    throw new Error('API_BASE_PATH must start with a slash "/"');
  if (!basePath.endsWith('/'))
    throw new Error('API_BASE_PATH must end with a slash "/"');
    
  console.log('Picking up base path "' + basePath + '".');
} else {
  console.log('Using base path "/".');
}

app.use(cors());
app.use(apiAuth); // require basic auth
app.use(userMapper); // Map authenticated-userid to internal user id, may create users
app.use(basePath + 'users', users);
app.use(basePath + 'notes', notes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
app.use(function(err, req, res, next) {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

module.exports = app;

'use strict';

const express = require('express');
const path = require('path');
const authenticate = require('./lib/authenticate');
// const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// const favicon = require('serve-favicon');
// const logger = require('morgan');

const sessions = require('./routes/sessions');
const tasks = require('./routes/tasks');

const app = express();

// Set up massive database interface
const massive = require('massive');
const connectionString = 'postgres://stevehook:@localhost/node_todo_development';
const massiveInstance = massive.connectSync({connectionString : connectionString});

app.set('db', massiveInstance);

// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/sessions', sessions);
app.use('/api/tasks', tasks);

module.exports = app;

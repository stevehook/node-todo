'use strict';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const path = require('path');
// const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// const favicon = require('serve-favicon');
// const logger = require('morgan');

const sessions = require('./routes/sessions');
const sessionsApi = require('./routes/api/sessions');
const tasksApi = require('./routes/api/tasks');

const app = express();
const db = require('./lib/database');
app.set('db', db);

// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', sessionsApi);
app.use('/api', tasksApi);

app.use('/', sessions);

module.exports = app;

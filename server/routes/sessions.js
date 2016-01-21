'use strict';

const express = require('express');
const authenticate = require('../lib/authenticate');
const router = express.Router();

router.get('/', authenticate, function(req, res, next) {
  res.send('Not implemented yet');
});

router.post('/', function(request, response, next) {
  response.status(200).json({});
});

module.exports = router;

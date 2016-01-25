'use strict';

const express = require('express');
const authenticate = require('../../lib/authenticate');
const router = express.Router();
const sessionRepository = require('../../lib/sessionRepository');

router.get('/sessions', authenticate, (req, res, next) => {
  res.send('Not implemented yet');
});

router.post('/sessions', (request, response, next) => {
  sessionRepository.login(request, (err, code, data) => {
    response.status(code).json(data);
  });
});

module.exports = router;

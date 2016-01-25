'use strict';

const express = require('express');
const router = express.Router();
const authenticate = require('../lib/authenticate');
const sessionRepository = require('../lib/sessionRepository');

router.post('/sessions', (request, response, next) => {
  sessionRepository.login(request, (err, code, data) => {
    response.render(code, data);
  });
});

module.exports = router;

'use strict';

const express = require('express');
const router = express.Router();
const authenticate = require('../lib/authenticate');
const sessionRepository = require('../lib/sessionRepository');

router.get('/login', (req, res, next) => {
  res.render('sessions/login');
});

router.post('/sessions', (request, response, next) => {
  sessionRepository.login(request, (err, code, data) => {
    response.status(code).render('index', data);
  });
});

module.exports = router;

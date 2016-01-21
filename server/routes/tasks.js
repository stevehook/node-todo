'use strict';

const express = require('express');
const router = express.Router();
const authenticate = require('../lib/authenticate');

router.get('/', authenticate, function(request, response, next) {
  let db = request.app.get('db');
  db.tasks.find({ user_id: request.currentUser.id }, function(err, tasks) {
    response.status(200).json(tasks);
  });
});

module.exports = router;

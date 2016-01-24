'use strict';

const express = require('express');
const router = express.Router();
const authenticate = require('../lib/authenticate');

router.get('/task/:id', authenticate, (request, response) => {
  let db = request.app.get('db');
  db.tasks.findOne({ id: request.params['id'], user_id: request.currentUser.id }, (err, task) => {
    response.status(200).json(task);
  });
});

router.get('/tasks', authenticate, (request, response) => {
  let db = request.app.get('db');
  db.tasks.find({ user_id: request.currentUser.id }, (err, tasks) => {
    response.status(200).json(tasks);
  });
});

module.exports = router;

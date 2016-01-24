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

router.post('/tasks', authenticate, (request, response) => {
  let db = request.app.get('db');
  let attributes = request.body;
  attributes.user_id = request.currentUser.id;
  db.tasks.save(attributes, (err, task) => {
    response.status(201).json(task);
  });
});

module.exports = router;

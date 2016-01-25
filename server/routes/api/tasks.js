'use strict';

const express = require('express');
const router = express.Router();
const authenticate = require('../../lib/authenticate');

const taskRepository = {
  get: (request, callback) => {
    let db = request.app.get('db');
    db.tasks.findOne({ id: request.params['id'], user_id: request.currentUser.id }, (err, task) => {
      callback(err, 200, task);
    });
  },
};

const respondWith = (request, response, view, code, data) => {
  if (request.accepts('json')) {
    response.status(code).json(data);
  } else {
    response.status(code).render(view, data);
  }
};

router.get('/task/:id', authenticate, (request, response) => {
  taskRepository.get(request, (err, code, data) => {
    if (err) {
      respondWith(request, response, 'show', 500, {});
    } else {
      respondWith(request, response, 'show', code, data);
    }
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

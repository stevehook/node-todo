'use strict';

const app = require('../app'),
      request = require('supertest'),
      expect = require('chai').expect;

describe('/apis/tasks', function() {
  let user;
  let tasks;
  let db = app.get('db');

  let createTestUser = (next, done) => {
    db.users.save({ name: 'Alice', email: 'alice@example.com' }, (err, user) => {
      db.tokens.save({ user_id: user.id, token: 'foo' }, (err, token) => {
        next(user, done);
      });
    });
  };
  let createTestTasks = (user, done) => {
    let taskFixtures = [
      { user_id: user.id, title: 'Walk the dog', completed: false, order: 1 },
      { user_id: user.id, title: 'Make the dinner', completed: false, order: 1 },
      { user_id: user.id + 1, title: 'Do the washing up', completed: false, order: 1 }
    ];
    tasks = [];
    taskFixtures.reverse().reduce((last, taskFixture) => {
      return () => { db.tasks.save(taskFixture, (err, task) => {
          tasks.push(task);
          last();
        });
      };
    }, done)();
  };

  beforeEach(function(done) {
    createTestUser(createTestTasks, done);
  });

  afterEach(function(done) {
    [db.users, db.tokens, db.tasks].reduce((last, collection) => {
      return () => { collection.destroy({}, (err, _) => { last(); }); }
    }, done)();
  });

  describe('GET /apis/tasks', function() {
    it('returns success', function(done) {
      request(app)
        .get('/api/tasks')
        .set('authorization', 'bearerToken foo')
        .expect(200, done);
    });

    it('returns a list of tasks for the current user', function(done) {
      request(app)
        .get('/api/tasks')
        .set('authorization', 'bearerToken foo')
        .end(function(err, res) {
          var tasks = JSON.parse(res.text);
          expect(tasks.length).to.eq(2);
          done();
        });
    });
  });

  describe('GET /apis/task/:id', function() {
    it('returns success', function(done) {
      request(app)
        .get('/api/task/' + tasks[0].id)
        .set('authorization', 'bearerToken foo')
        .expect(200, done);
    });

    it('returns the task data', function(done) {
      request(app)
        .get('/api/task/' + tasks[0].id)
        .set('authorization', 'bearerToken foo')
        .end(function(err, res) {
          var task = JSON.parse(res.text);
          expect(task.title).to.eq('Walk the dog');
          done();
        });
    });
  });
});

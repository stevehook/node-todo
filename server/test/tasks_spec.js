'use strict';

const app = require('../app'),
      request = require('supertest'),
      expect = require('chai').expect;

describe('GET /apis/sessions', function() {
  let user;
  let db = app.get('db');

  beforeEach(function(done) {
    db.users.save({ name: 'Alice', email: 'alice@example.com' }, (err, user) => {
      db.tokens.save({ user_id: user.id, token: 'foo' }, (err, user) => {
        done();
      });
    });
  });
  afterEach(function(done) {
    db.users.destroy({}, (err, _) => {
      db.tokens.destroy({}, (err, _) => {
        done();
      });
    });
  });

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

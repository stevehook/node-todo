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

  it('returns success when I provide a valid token', function(done) {
    request(app)
      .get('/api/sessions')
      .set('authorization', 'bearerToken foo')
      .expect(200, done);
  });

  it('returns Forbidden (403) when I provide an invalid token', function(done) {
    request(app)
      .get('/api/sessions')
      .set('authorization', 'bearerToken bar')
      .expect(403, done);
  });

  it('returns Forbidden (403) when I do not provide a token', function(done) {
    request(app)
      .get('/api/sessions')
      .expect(403, done);
  });
});

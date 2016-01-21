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

  describe('GET /apis/sessions', function() {
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

  describe('POST /login API', function() {
    var credentials = { email: 'bob@example.com', password: 'secret' };

    it('allows a user to login with the correct credentials', function(done) {
      request(app)
        .post('/api/sessions')
        .send(credentials)
        .expect(200, done);
    });

    it('returns a JSON Web token given correct credentials', function(done) {
      request(app)
        .post('/api/sessions')
        .send(credentials)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          var json = JSON.parse(res.text);
          expect(json).to.be.defined;
          expect(json.success).to.eq(true);
          expect(json.data.name).to.eq('Bob Roberts');
          expect(json.data.email).to.eq('bob@example.com');
          expect(json.token).to.be.defined;
          done();
        });
    });

    it('does not allow a user to login with the wrong password', function(done) {
      request(app)
        .post('/api/sessions')
        .send({ email: 'bob@example.com', password: 'wrong' })
        .expect(403, done);
    });

    it('does not allow a user to login with the wrong email', function(done) {
      request(app)
        .post('/api/sessions')
        .send({ email: 'wrong@example.com', password: 'secret' })
        .expect(403, done);
    });
  });
});

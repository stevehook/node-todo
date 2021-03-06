'use strict';

const app = require('../app');
const request = require('supertest');
const expect = require('chai').expect;
const hashPassword = require('../lib/hashPassword');

describe('/apis/sessions', () => {
  let user;
  let db = app.get('db');

  beforeEach((done) => {
    hashPassword('secret', (err, hash) => {
      db.users.save({ name: 'Alice', email: 'alice@example.com', password: hash }, (err, user) => {
        db.tokens.save({ user_id: user.id, token: 'foo' }, (err, user) => {
          done();
        });
      });
    });
  });
  afterEach((done) => {
    db.users.destroy({}, (err, _) => {
      db.tokens.destroy({}, (err, _) => {
        done();
      });
    });
  });

  describe('GET /apis/sessions', () => {
    it('returns success when I provide a valid token', (done) => {
      request(app)
        .get('/api/sessions')
        .set('authorization', 'bearerToken foo')
        .expect(200, done);
    });

    it('returns Forbidden (403) when I provide an invalid token', (done) => {
      request(app)
        .get('/api/sessions')
        .set('authorization', 'bearerToken bar')
        .expect(403, done);
    });

    it('returns Forbidden (403) when I do not provide a token', (done) => {
      request(app)
        .get('/api/sessions')
        .expect(403, done);
    });
  });

  describe('POST /login API', () => {
    var credentials = { email: 'alice@example.com', password: 'secret' };

    it('allows a user to login with the correct credentials', (done) => {
      request(app)
        .post('/api/sessions')
        .send(credentials)
        .expect(200, done);
    });

    it('returns a JSON Web token given correct credentials', (done) => {
      request(app)
        .post('/api/sessions')
        .send(credentials)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          var json = JSON.parse(res.text);
          expect(json).to.be.defined;
          expect(json.success).to.eq(true);
          expect(json.data.name).to.eq('Alice');
          expect(json.data.email).to.eq('alice@example.com');
          expect(json.token).to.be.defined;
          done();
        });
    });

    it('does not allow a user to login with the wrong password', (done) => {
      request(app)
        .post('/api/sessions')
        .send({ email: 'alice@example.com', password: 'wrong' })
        .expect(403, done);
    });

    it('does not allow a user to login with the wrong email', (done) => {
      request(app)
        .post('/api/sessions')
        .send({ email: 'wrong@example.com', password: 'secret' })
        .expect(403, done);
    });
  });
});

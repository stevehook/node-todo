'use strict';

const app = require('../app'),
      request = require('supertest'),
      // db = require('../models'),
      // helpers = require('./specHelper'),
      expect = require('chai').expect;

describe('GET /apis/sessions', function() {
  let user;

  beforeEach(function(done) {
    // TODO: Set up a user
    done();
  });
  afterEach(function(done) {
    // TODO: Tear down data
    done();
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

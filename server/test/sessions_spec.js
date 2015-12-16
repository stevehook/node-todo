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
      .get('/login')
      .set('authorization', 'bearerToken foo')
      .expect(200, done);
  });
});

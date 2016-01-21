'use strict';

const express = require('express');
const authenticate = require('../lib/authenticate');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.get('/', authenticate, function(req, res, next) {
  res.send('Not implemented yet');
});

var checkPassword = function(user, password, done) {
  bcrypt.compare(password, user.password, (err, res) => {
    done(err, res);
  });
};

router.post('/', function(request, response, next) {
  let db = request.app.get('db');
  db.users.findOne({ email: request.body.email }, (err, user) => {
    if (user) {
      checkPassword(user, request.body.password, (err, matched) => {
        if (matched) {
          var tokenString = jwt.sign({ data: user, timestamp: new Date()}, process.env.JWT_SECRET, { expiresInSeconds: 3600 });
          db.tokens.save({
            user_id: user.id,
            token: tokenString
          }, (err, token) => {
            response.status(200).json({
              success: true,
              data: {
                name: user.name,
                email: user.email
              },
              token: token.token
            });
          });
        } else {
          console.log(request.body, err, matched);
          response.status(403).json({ success: false, error: 'Login failed' });
        }
      });
    } else {
      response.status(403).json({ success: false, error: 'Login failed' });
    }
  });
});

module.exports = router;

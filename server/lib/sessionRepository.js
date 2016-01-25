'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const sessionRepository = {
  checkPassword: (user, password, done) => {
    bcrypt.compare(password, user.password, (err, res) => {
      done(err, res);
    });
  },

  login: (request, callback) => {
    let db = request.app.get('db');
    db.users.findOne({ email: request.body.email }, (err, user) => {
      if (user) {
        sessionRepository.checkPassword(user, request.body.password, (err, matched) => {
          if (matched) {
            let tokenString = jwt.sign({ data: user, timestamp: new Date()}, process.env.JWT_SECRET, { expiresIn: 3600 });
            db.tokens.save({
              user_id: user.id,
              token: tokenString
            }, (err, token) => {
              callback(null, 200, {
                success: true,
                data: {
                  name: user.name,
                  email: user.email
                },
                token: token.token
              });
            });
          } else {
            callback(null, 403, { success: false, error: 'Login failed' });
          }
        });
      } else {
        callback(null, 403, { success: false, error: 'Login failed' });
      }
    });
  }
};

module.exports = sessionRepository;

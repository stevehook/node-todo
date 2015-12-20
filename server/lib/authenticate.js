'use strict';

const timeout = parseInt(process.env.TOKEN_TIMEOUT || 20);

const verifyTokenTimeout = function(token, callback) {
  let now = new Date();
  let utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
  let twentyMinutesAgo = new Date(utc.setMinutes(utc.getMinutes() - timeout));
  if (token.updatedAt < twentyMinutesAgo) {
    callback(null, false);
  } else {
    token.save().then(function() {
      callback(null, true);
    });
  }
};

const authenticate = function(request, response, next) {
  let db = request.app.db;
  let bearerHeader = request.headers.authorization;
  if (typeof bearerHeader !== 'undefined') {
    let bearer = bearerHeader.split(' ');
    let bearerToken = bearer[1];
    request.currentUser = undefined;
    if (bearerToken) {
      request.token = bearerToken;
      db.tokens.findOne({ token: bearerToken }, function(err, token) {
        if (token) {
          verifyTokenTimeout(token, function(err, verified) {
            if (err || !verified) {
              response.sendStatus(403);
            } else {
              let user = db.users.findOne({ id: token.user_id }, function(err, user) {
                request.currentUser = user;
                next();
              });
            }
          });
        } else {
          response.sendStatus(403);
        }
      });
    } else {
      response.sendStatus(403);
    }
  } else {
    response.sendStatus(403);
  }
};

module.exports = authenticate;

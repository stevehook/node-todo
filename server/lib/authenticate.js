'use strict';

const timeout = parseInt(process.env.TOKEN_TIMEOUT || 20);

const verifyTokenTimeout = (db, token, callback) => {
  let now = new Date();
  let utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
  let twentyMinutesAgo = new Date(utc.setMinutes(utc.getMinutes() - timeout));
  if (token.updatedAt < twentyMinutesAgo) {
    callback(null, false);
  } else {
    db.tokens.save(token, (err, _) => {
      callback(err, true);
    });
  }
};

const authenticate = (request, response, next) => {
  let db = request.app.get('db');
  let bearerHeader = request.headers.authorization;
  if (typeof bearerHeader !== 'undefined') {
    let bearer = bearerHeader.split(' ');
    let bearerToken = bearer[1];
    request.currentUser = undefined;
    if (bearerToken) {
      request.token = bearerToken;
      db.tokens.findOne({ token: bearerToken }, (err, token) => {
        if (token) {
          verifyTokenTimeout(db, token, (err, verified) => {
            if (err || !verified) {
              response.sendStatus(403);
            } else {
              let user = db.users.findOne({ id: token.user_id }, (err, user) => {
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

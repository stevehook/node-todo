const bcrypt = require('bcrypt');

module.exports = function(password, done) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(password, salt, done);
  });
};

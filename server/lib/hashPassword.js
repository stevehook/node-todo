const bcrypt = require('bcrypt');

module.exports = (password, done) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, done);
  });
};

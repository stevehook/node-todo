'use strict';

require('dotenv').config();

const hashPassword = require('../lib/hashPassword');
const db = require('../lib/database');

db.users.destroy({}, (err, _) => {
  hashPassword('secret', (err, hash) => {
    db.users.save({ name: 'Bob', email: 'bob@example.com', password: hash }, (err, user) => {
      process.exit();
    });
  });
});

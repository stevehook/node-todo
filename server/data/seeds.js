'use strict';

require('dotenv').config();

const hashPassword = require('../lib/hashPassword');

const massive = require('massive');
const connectionString = 'postgres://stevehook:@localhost/node_todo_development';
const db = massive.connectSync({connectionString : connectionString});

db.users.destroy({}, (err, _) => {
  hashPassword('secret', (err, hash) => {
    db.users.save({ name: 'Bob', email: 'bob@example.com', password: hash }, (err, user) => {
      process.exit();
    });
  });
});

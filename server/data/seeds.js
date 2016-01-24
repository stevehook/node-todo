'use strict';

require('dotenv').config();

const hashPassword = require('../lib/hashPassword');
const db = require('../lib/database');

db.users.destroy({}, (err, _) => {
  hashPassword('secret', (err, hash) => {
    db.users.save({ name: 'Bob', email: 'bob@example.com', password: hash }, (err, user) => {
      let taskFixtures = [
        { user_id: user.id, title: 'Walk the dog', completed: false, order: 1 },
        { user_id: user.id, title: 'Make the dinner', completed: false, order: 1 },
        { user_id: user.id, title: 'Do the washing up', completed: false, order: 1 }
      ];
      taskFixtures.reverse().reduce((last, taskFixture) => {
        return () => { db.tasks.save(taskFixture, (err, task) => {
            last();
          });
        };
      }, () => process.exit())();
    });
  });
});

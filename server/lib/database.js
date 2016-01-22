const massive = require('massive');
const connectionString = `postgres://stevehook:@localhost/node_todo_${process.env.NODE_ENV}`;
module.exports = massive.connectSync({connectionString : connectionString});

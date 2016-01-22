const massive = require('massive');
const connectionString = 'postgres://stevehook:@localhost/node_todo_development';
module.exports = massive.connectSync({connectionString : connectionString});

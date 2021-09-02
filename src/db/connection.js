const monk = require('monk');
const config = require('config');
const connectionString = config.get('MONGODB_URI') || 'localhost';
const db = monk(connectionString);

db.catch(function(err) {
  console.error(err);
  console.error('DB CONNECTION FAILED');
});

module.exports = db;

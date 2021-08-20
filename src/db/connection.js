const monk = require('monk');
const connectionString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/';
const db = monk(connectionString);

db.catch(function(err) {
  console.error(err);
  console.error('DB CONNECTION FAILED');
});

module.exports = db;

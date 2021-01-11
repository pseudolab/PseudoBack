const monk = require('monk');
const connectionString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/';
const db = monk(connectionString);
 
module.exports = db;
const middlewares = require('./middlewares')
const social = require('./social')
module.exports = {
  middlewares,
  requireLogin: middlewares.requireLogin,
  ...social
}
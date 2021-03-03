const middlewares = require('./middlewares')
module.exports = {
  middlewares,
  requireLogin: middlewares.requireLogin,
}
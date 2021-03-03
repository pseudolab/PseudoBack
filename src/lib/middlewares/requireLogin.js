// https://stackoverflow.com/questions/31063153/how-to-perform-login-redirect-with-nodejs-expressjs

const passport = require('passport')

function requireLogin(req, res, next){
  if (!req.user) {
    const returnTo = req.originalUrl
    const state = returnTo
      ? Buffer.from(JSON.stringify({ returnTo })).toString('base64')
      : undefined
    
    const authenticator = passport.authenticate('google', { scope: ['email'], prompt: 'select_account', state})

    authenticator(req, res, next)
  }
  else{
    console.debug('user not null, passing')
    next();
  } 
}

module.exports=requireLogin
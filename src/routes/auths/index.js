const router=require('express').Router()
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , GoogleStrategy = require('passport-google-oauth20').Strategy;
const { requireLogin } = require('../../lib');
require('dotenv').config()

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_APP_ID,
  clientSecret: process.env.GOOGLE_APP_SECRET,
  callbackURL: "/routes/auths/google/callback",
  accessType: 'offline',
  prompt: 'consent',
  },

  function(accessToken, refreshToken, profile, done) {

    profile.userID=Number(profile.id) // make userID
    profile.refreshToken = refreshToken
    profile.accessToken = accessToken
    return done(undefined, profile)
  }
  ));

router.get(
  `/google/callback`,
  passport.authenticate('google', { failureRedirect: '/-/failure' }),
  (req, res) => {
    try {
      const { state } = req.query
      const { returnTo } = JSON.parse(Buffer.from(state, 'base64').toString())
      
      if (typeof returnTo === 'string' && returnTo.startsWith('/')) {
        return res.redirect(returnTo)
      }
    } catch (e){
      // just redirect normally below
      console.error(e)
      res.json({err: 'login err'})
      return
    }
    res.redirect('/')
  },
)

router.get('/login', 
  requireLogin,
  function(req, res) {
    res.redirect('/routes/auths/success')
  }
);

router.get('/test', (req,res)=>{
  res.redirect('/routes')
})

router.get('/success', (req, res)=>{
  console.log('success')
  res.sendStatus(200)
})

router.get('/failure', (req,res)=>{
  res.sendStatus(401) // Unauthorized
})

router.get('/logout', function(req, res){
  req.logout();
  console.info('logout success')
  res.redirect('/routes/auths/login')
});

router.get('/authTest',
  requireLogin,
  function(req, res) {
    var user = req.user
    console.info('authTest success, user:')
    console.debug(user)

    res.json({user: req.user, cookies: req.cookies, signedCookies: req.signedCookies})
  }
);

module.exports = router;
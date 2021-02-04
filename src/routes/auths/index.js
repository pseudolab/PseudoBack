const router=require('express').Router()
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config()

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_APP_ID,
  clientSecret: process.env.GOOGLE_APP_SECRET,
  callbackURL: "/routes/auths/google/callback",
  accessType: 'offline',
  prompt: 'consent',
  },

  function(accessToken, refreshToken, profile, done) {
    console.log('authenticated')
    console.log(accessToken)
    console.log(refreshToken)
    console.log(profile)
    profile.userID=Number(profile.id) // make userID
    return done(undefined, profile)
  }
  ));

router.get('/login', 
  passport.authenticate('google', {
    scope:['email'], failureRedirect: '/routes/auths/failure' }),
  function(req, res) {
    console.log('req; ')
    console.log(req)
    res.redirect('/routes');
  }
);

router.get('/test', (req,res)=>{
  res.redirect('/routes')
})

// router.post('/google',
//   passport.authenticate('google', { scope: ['profile'] })
//   );

// router.get('/google',
//   passport.authenticate('google', { scope: ['profile'] }));

// router.get('/google/callback',
//   passport.authenticate( 'google', {
//       successRedirect: '/routes/auths/success',
//       failureRedirect: '/routes/auths/failure'
// }));

router.get('/success', (req, res)=>{
  console.log('success')
  // console.info(req)
  console.log(req.user)
  console.log(req.session)
  res.sendStatus(200)
})

router.get('/failure', (req,res)=>{
  res.sendStatus(400)
})

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/routes/auths/login' }),
  function(req, res) {
    console.log('success')
    console.log(req.user)
    // Successful authentication, redirect home.
    res.redirect('/routes/auths/success');
  });


router.get('/authTest',
  function(req, res) {
    var user = req.session.user;
    console.log('req')
    console.log(req.session)
    console.log(req.user)
    console.log(req.cookies)
    console.log(req.signedCookies)
    if(!user){
      res.redirect('/routes/auths/login')
      return
    }
    console.log(req.user)
    // var account = req.account;

    // // Associate the Twitter account with the logged-in user.
    // account.userId = user.id;
    // account.save(function(err) {
    //   if (err) { return self.error(err); }
    //   self.redirect('/');
    // });

    res.sendStatus(201)
  }
);

module.exports = router;
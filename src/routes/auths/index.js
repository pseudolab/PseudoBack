const router=require('express').Router()
// const socialRoutes=require('./social')
const { requireLogin } = require('../../lib');

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

router.get('/tokeninfo', requireLogin, (req,res)=>{
  console.log('tokeninfo!')
  res.sendStatus(200)
})

// router.use('/social', socialRoutes)

module.exports = router;
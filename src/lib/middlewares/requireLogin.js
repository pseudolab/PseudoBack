// https://stackoverflow.com/questions/31063153/how-to-perform-login-redirect-with-nodejs-expressjs
const social = require('../social');
const db = require('@db/users');

async function requireLogin(req, res, next) {
  try {
    const token = req.query.id_token;
    // get user id
    const userid = await social.getGoogleUserID(token);
    // check user exists
    const user = await db.findByGoogleId(userid);
    console.log('LOG USER')
    console.info(user)
    if(!user) {
      console.info('no user registered for this userid')
      // register 처리
      res.redirect('http://localhost:3000/login');
      return;
    }
    req.user = user;
    next();
  } catch (error) {
    // authentication fail
    console.error('requireLogin failed');
    console.error(error);
    res.redirect('http://localhost:3000/login');
  }
}

module.exports=requireLogin
// https://stackoverflow.com/questions/31063153/how-to-perform-login-redirect-with-nodejs-expressjs
const social = require('../social');
<<<<<<< HEAD
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
=======
const users = require('@db/users');

async function requireLogin(req, res, next) {
  try {
    // const token = req.query.id_token;
    const token = req.get('auth-token');
    // get user id
    const userInfo = await social.getGoogleUserInfo(token);
    // check user exists
    const user = await users.get(userInfo.userid);
    if(!user) {
      console.info('no user registered for this userid')

      // // register 리다이렉트
      // res.redirect('http://localhost:3000/register');
      // return;

      const createdUser = await users.create({
        provider: 'google',
        userID: userInfo.userid,
        userMail: userInfo.email,
        userName: userInfo.username,
        photo: userInfo.photo
      })
      
      res.json(createdUser);
>>>>>>> Pseudo-Lab-main
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
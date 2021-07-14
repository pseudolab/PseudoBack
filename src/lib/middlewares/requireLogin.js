// https://stackoverflow.com/questions/31063153/how-to-perform-login-redirect-with-nodejs-expressjs
const social = require('../social');
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
      
      // res.json(createdUser);
      // return;
      req.user = createdUser;
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
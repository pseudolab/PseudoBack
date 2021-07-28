// https://stackoverflow.com/questions/31063153/how-to-perform-login-redirect-with-nodejs-expressjs
const social = require('../social');
const users = require('@db/users');

async function requireLogin(req, res, next) {
  try {
    const token = req.get('auth-token');
    const userInfo = await social.getGoogleUserInfo(token);
    const user = await users.get(userInfo.userid);
    if(!user) {
      const createdUser = await users.create({
        provider: 'google',
        userID: userInfo.userid,
        userMail: userInfo.email,
        userName: userInfo.username,
        photo: userInfo.photo
      })
      
      req.user = createdUser;
    } else {
      req.user = user;
    }
    next();
  } catch (error) {
    // authentication fail
    console.error('requireLogin failed');
    console.error(error);
    res.redirect('http://localhost:3000/login');
  }
}

module.exports=requireLogin
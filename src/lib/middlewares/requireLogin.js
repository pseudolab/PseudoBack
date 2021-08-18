// https://stackoverflow.com/questions/31063153/how-to-perform-login-redirect-with-nodejs-expressjs
const social = require('../social');
const users = require('@db/users');
const config = require('config');

const USE_FAKE_LOGIN = config.get('USE_FAKE_LOGIN');

async function requireLogin(req, res, next) {
  if(USE_FAKE_LOGIN) {
    console.warn('USING FAKE LOGIN');
    const createdUser = await users.create({
      provider: 'google',
      google: config.get('FAKE_LOGIN_USER'),
      // photo: 'http://fakeuser.photo.url'
    })

    req.user = createdUser;
    next();
    return;
  }

  try {
    const token = req.get('auth-token');
    const userInfo = await social.getGoogleUserInfo(token);
    // TODO: use googleid
    const user = await users.get(userInfo.userid);
    if(!user) {
      const createdUser = await users.create({
        provider: 'google',
        google: {
          userID: userInfo.userid,
          userName: userInfo.username,
          userMail: userInfo.email,
          photo: userInfo.photo
        }
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
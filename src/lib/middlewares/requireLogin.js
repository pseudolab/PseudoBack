// https://stackoverflow.com/questions/31063153/how-to-perform-login-redirect-with-nodejs-expressjs
const social = require('../social');
const users = require('@db/users');
require('dotenv').config();

async function requireLogin(req, res, next) {
  if(process.env.NODE_ENV === 'development' && process.env.USE_FAKE_LOGIN) {
    const createdUser = await users.create({
      provider: 'google',
      google: {
        userID: 'fakeuserid',
        userMail: 'fakeuser@pseudo.com',
        userName: 'fakeuser-name',
      }
      // photo: 'http://fakeuser.photo.url'
    })
    
    req.user = createdUser;
    next();
    return;
  }

  try {
    const token = req.get('auth-token');
    const userInfo = await social.getGoogleUserInfo(token);
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
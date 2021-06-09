const express = require('express')
const router = express.Router()
const { requireLogin } = require('../lib/middlewares');

//라우팅 모듈 선언
const postsRouter = require('./posts')
const usersRouter = require('./users');
const qnasRouter = require('./qnas');
const pofilesRouter = require('./profiles');
const categoriesRouter = require('./categories');

//request 요청 URL과 처리 로직을 선언한 라우팅 모듈 매핑
router.use('/posts', postsRouter);
router.use('/users', usersRouter);
router.use('/qnas', qnasRouter);
router.use('/profiles', requireLogin, pofilesRouter);
router.use('/categories', categoriesRouter);

if(process.env.NODE_ENV === 'development') {
  console.warn('DEVELOPMENT ROUTE ACTIVATED')
  const db = require('@db/users');
  router.get('/dev/:command', async (req, res) => {
    const command = req.params.command;
    
    switch (command) {
      case 'drop':
        console.warn('DROP ALL USERS');
        db.dropAll();
        break;
    
      default:
        break;
    }
    res.sendStatus(200);
  });
}

// Add more routes here if you want!
module.exports = router
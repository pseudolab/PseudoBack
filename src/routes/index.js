const express = require('express')
const router = express.Router()
const { requireLogin } = require('../lib/middlewares');

//라우팅 모듈 선언
const postsRouter = require('./posts')
const usersRouter = require('./users');
const qnasRouter = require('./qnas');
const pofilesRouter = require('./profiles');
const categoriesRouter = require('./categories');
const devRouter = require('./dev');

//request 요청 URL과 처리 로직을 선언한 라우팅 모듈 매핑
router.use('/posts', postsRouter);
router.use('/users', usersRouter);
router.use('/qnas', qnasRouter);
router.use('/profiles', pofilesRouter);
router.use('/categories', categoriesRouter);

if(process.env.NODE_ENV === 'development') {
  console.warn('DEVELOPMENT ROUTE ACTIVATED')
  router.use('/dev', devRouter);
}

// Add more routes here if you want!
module.exports = router
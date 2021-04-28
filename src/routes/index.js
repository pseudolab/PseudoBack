const express = require('express')
const router = express.Router()

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
router.use('/profiles', pofilesRouter);
router.use('/categories', categoriesRouter);

// Add more routes here if you want!
module.exports = router
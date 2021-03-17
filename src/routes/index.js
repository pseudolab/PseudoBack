const express = require('express')
const router = express.Router()

//라우팅 모듈 선언
const postsRouter = require('./posts')
const usersRouter = require('./users');
const authsRouter = require('./auths');
const qnasRouter = require('./qnas');
const pofilesRouter = require('./profiles');
const { requireLogin } = require('../lib/middlewares');

//request 요청 URL과 처리 로직을 선언한 라우팅 모듈 매핑
router.get('/', (req,res)=>{
  console.log('root')
  // console.log(req)
  res.sendStatus(200)
})
router.use('/posts', postsRouter);
router.use('/users', usersRouter)
router.use('/auths', authsRouter)
router.use('/users', usersRouter);
router.use('/qnas', qnasRouter);
router.use('/profiles', requireLogin, pofilesRouter);

// Add more routes here if you want!
module.exports = router
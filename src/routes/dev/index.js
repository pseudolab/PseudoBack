const dev = require('express').Router();
const users = require('@db/users');
const { requireLogin } = require('../../lib/middlewares');

const userRouter = require('./user');

dev.get('/check', (req, res) => {
  console.info('check call');
  res.sendStatus(200);
})

dev.get('/user/reset', async (req,res)=>{
  console.warn('DROP ALL USERS');
  
  await users.dropAll();
  res.sendStatus(203);
})

dev.use('/user', requireLogin, userRouter);

module.exports = dev;
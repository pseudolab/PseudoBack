const dev = require('express').Router();
const db = require('@db/users');

dev.get('/check', (req, res) => {
  console.info('check call');
  res.sendStatus(200);
})

dev.get('/reset', async (req,res)=>{
  console.log('delete all');
  
  await db.dropAll();
  res.sendStatus(203);
  
})

module.exports = dev;
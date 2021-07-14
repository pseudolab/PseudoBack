const dev = require('express').Router();
const db = require('@db/users');

// router.get('/dev/:command', async (req, res) => {
//   const command = req.params.command;
  
//   switch (command) {
//     case 'drop':
//       db.dropAll();
//       break;
  
//     default:
//       break;
//   }
//   res.sendStatus(200);
// });

dev.get('/check', (req, res) => {
  console.info('check call');
  res.sendStatus(200);
})

dev.get('/create-user', async (req,res)=>{
  console.warn('create new user');
  await db.dropAll();
  const response = await db.create({
    provider: 'google',
    id: 'uid1',
    userMail: 'asd@asd.com',
    userID: 'uid2',
    userName: 'Epikem'
  });

  console.log(response);

  res.status(200).json(response);
})

dev.get('/reset', async (req,res)=>{
  console.warn('DROP ALL USERS');
  
  await db.dropAll();
  res.sendStatus(203);
  
})

module.exports = dev;
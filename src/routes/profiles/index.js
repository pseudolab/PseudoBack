const router = require('express').Router();
const db = require('@db/profiles');

router.get('/my', async (req, res) => {
  // requireLogin registers req.user
  const myProfile = req.user;
  console.info('my profile route called')

  res.json(myProfile);
}); 

router.get('/:userID', async (req, res) => {
  const userID = req.params.userID;
  const foundUser = await db.get(userID);

  if(!foundUser) {
    console.warn('user not found')
    res.sendStatus(404);
    return;
  }

  res.json(foundUser);
}); 

module.exports=router;

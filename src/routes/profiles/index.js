const router = require('express').Router();
const db = require('@db/profiles');


router.get('/:userID', async (req, res) => {
  const userID= Number(req.params.userID);
  console.log(userID);
  db.get(userID).then((user) => {
    //user['password'] = '-';
    //user['repeatPassword'] = '-';
    res.json(user);
  });
}); 

module.exports=router;
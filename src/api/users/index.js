const router = require('express').Router();
const db = require('@db/users');

router.get('/', async (req, res) => {
  const userId=req.body.userId;

  if(userId){
    console.log('searchng', userId)
    const result = await db.get(userId);
    res.json(result);
  } else {
    // test only
    db.getAll().then((users) => {
      res.json(users)
    })
  }
}); 

router.post('/', (req, res) => {
  console.log(req.body);
  db.create(req.body).then((user) => {
      res.json(user);
  }).catch((error) => {
      res.status(500);
      res.json(error);
  });
});

module.exports=router;
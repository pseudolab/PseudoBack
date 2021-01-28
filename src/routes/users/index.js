const router = require('express').Router();
const db = require('@db/users');

router.get('/', (req, res) => {
  db.getAll().then((users) => {
    res.json(users)
  })
});

router.get('/:userID', async (req, res) => {
  const userID= Number(req.params.userID);
  const result = await db.get(userID);
  res.json(result);
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
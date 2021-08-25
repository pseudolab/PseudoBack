const router = require('express').Router();
const db = require('@db/users');
const { requireLogin } = require('@lib');

router.get('/', (req, res) => {
  db.getAll().then((users) => {
    res.json(users)
  })
});

router.get('/:userID', async (req, res) => {
  const userID = req.params.userID;
  const result = await db.get(userID);
  res.json(result);
}); 

// NOTE: 관리자만 접근 가능하도록 함
router.post('/', requireLogin, (req, res) => {
  try {
    if (req.user && req.user.isAdmin) {
      console.log(req.body);
      db.create(req.body).then((user) => {
        res.json(user);
      }).catch((error) => {
        console.error(error);
        res.status(500);
        res.json(error);
      });
    } else {
      res.status(403);
      res.json({ error: 'You are not an admin' });
    }
  } catch (error) {
    console.error(error);
    res.status(500);
    res.json(error);
  }
});

module.exports=router;
const router = require('express').Router();
const db = require('@db/categories');
const { requireLogin } = require('@lib');

router.get('/:categoryName', (req, res) => {
  const categoryName= req.params.categoryName;
  db.get(categoryName).then((category) => {
    res.json(category);
  });
}); 

router.get('/', (req, res) => {
  db.getAll().then((category) => {
    res.json(category);
  });
}); 

router.post('/', requireLogin, (req, res) => {
  db.create(req.body).then((category) => {
      res.json(category);
  }).catch((error) => {
      res.status(500);
      res.json(error);
  });
}); 

router.put('/:categoryName', requireLogin, (req, res) => {
  const categoryName= req.params.categoryName;
  db.update(categoryName, req.body).then((category) => {
    res.json(category);
  });
}); 

router.delete('/:categoryName', requireLogin, (req, res) => {
  const categoryName= req.params.categoryName;
  db.remove(categoryName).then((category) => {
    res.json(category);
  });
}); 

module.exports=router;
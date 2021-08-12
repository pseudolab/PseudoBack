const router = require('express').Router();
const db = require('@db/categories');


router.get('/', (req, res) => {
  db.getAll().then((category) => {
    res.json(category);
  });
}); 

router.get('/:categoryName', (req, res) => {
  const categoryName= req.params.categoryName;
  const user_db = require('@db/users');
  db.get(categoryName).then((category) => {
    user_db.get(category['builder']).then((user)=>{
      category['builderImage'] = user['profileImageURL'];
      res.json(category);
    }).catch((error)=>{
      res.status(500);
      res.json(error);
    });
  });
}); 

  router.post('/', (req, res) => {
    db.create(req.body).then((category) => {
        res.json(category);
    }).catch((error) => {
        res.status(500);
        res.json(error);
    });
  }); 

router.put('/:categoryName', (req, res) => {
    const categoryName= req.params.categoryName;
    db.update(categoryName, req.body).then((category) => {
      res.json(category);
    });
  }); 

router.delete('/:categoryName', (req, res) => {
    const categoryName= req.params.categoryName;
    db.remove(categoryName).then((category) => {
      res.json(category);
    });
  }); 

module.exports=router;
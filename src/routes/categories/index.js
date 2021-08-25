const router = require('express').Router();
const db = require('@db/categories');
const { requireLogin } = require('@lib');

router.get('/', (req, res) => {
  db.getAll().then((category) => {
    res.json(category);
  });
}); 

router.get('/:categoryName',  requireLogin, async (req, res) => {
  const userDB = require('@db/users');
  const user = req.user;
  const userID = req.params.userID;
  console.log(user)
  console.log(userID)
  const categoryName= req.params.categoryName;
  db.get(categoryName).then((category) => {
    userDB.get(category['builder']).then((user)=>{
      category['builderImage'] = user['profileImageURL'];
      res.json(category);
    }).catch((error)=>{
      res.status(500);
      res.json(error);
    });
  });
});

router.post('/',  requireLogin, async (req, res) => {
  const userDB = require('@db/users');
  const userID = req.params.userID;
  const user = req.user;
  console.log(user)
  if(!user['isAdmin']){
    res.status(500);
  }
  db.create(req.body).then((category) => {
      res.json(category);
  }).catch((error) => {
      res.status(500);
      res.json(error);
  });
}); 

router.put('/:categoryName',  requireLogin, async (req, res) => {
  if(!user['isAdmin']){
    res.status(500);
  }
  const categoryName= req.params.categoryName;
  db.update(categoryName, req.body).then((category) => {
    res.json(category);
  });
}); 

// request joining study
router.put('/cowriter/:categoryName',  requireLogin, async (req, res) => {
  const categoryName= req.params.categoryName;
  category = await db.get(categoryName)
  userInfo = req.user
  category['cowriter'].forEach((v,i,arr)=>{
    console.log(v['id'] + userInfo['id'])
    if(v['id'] == userInfo['id']) {
      res.status(500)
      res.json(category)
    }
  })
  if(res.statusCode != 500){
    category['cowriter'].push({"id":userInfo['id'], "name":userInfo['name'], "status":false})
    delete category._id
    db.update(categoryName, category).then((category) => {
      res.json(category);
    });
  }
}); 

// approve joining study
router.put('/cowriter/approve/:categoryName',  requireLogin, async (req, res) => {
  user = req.user;
  if(!user['isAdmin']){
    res.status(500);
  } else{
    const userDB = require('@db/users');
    const categoryName= req.params.categoryName;
    const cowriterId = req.body.cowriterId;
    category = await db.get(categoryName)
    category['cowriter'].forEach((v,i) => {
      if(v['id'] == cowriterId){
        v['status'] = true;
      }
    });
    delete category._id;
    db.update(categoryName, category).then((category) => {
      res.json(category);
    });
  }
}); 

router.delete('/:categoryName', requireLogin, async (req, res) => {
  const userDB = require('@db/users');
  const user = req.user;
  console.log(user)
  if(!user['isAdmin']){
    res.status(500);
  }
  const categoryName= req.params.categoryName;
  db.remove(categoryName).then((category) => {
    res.json(category);
  });
}); 

module.exports=router;
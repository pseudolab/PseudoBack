const express = require('express');
const router = express.Router();
const posts = require('@db/posts');
//const multiparty = require('multiparty');
const querystring = require('querystring');

const multer = require('multer');

/**
* BaseUrl : web.js router에 선언한 BaseUrl을 표시. request url을 쉽게 파악하기 위함
*  : /club
*/

const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { requireLogin } = require('../../lib/middlewares');

router.use(morgan('tiny'));
router.use(cors());
router.use (bodyParser.urlencoded ({extended : true})); 
router.use(bodyParser.json());
  

router.get('/', (req, res) => {
    const category = req.query.category;
    let queryMap = null
    if (category != undefined){
        queryMap = {"category" : category};
    }
    posts.getAll(queryMap).then((post) => {
        res.json(post);
    });
});

router.get('/:id', (req, res) => {
    const postID = Number(req.params.id);
    posts.get(postID).then((post) => {
        const fs = require('fs');
        console.log(post);
        try{
            const filename = post['content'];
            const content = fs.readFileSync(filename).toString();
            post['content'] = content;
        } catch(error){
        }
        res.json(post);
    });
});

const multerConfig = {
    storage: multer.diskStorage({
    destination: function (req, file, next) {
            next(null, 'images');
    },
    filename: function (req, file, next) {
        next(null, Date.now()+'_'+file.originalname)
    }
   })
  };

  router.post('/', multer(multerConfig).array('images'),function(req, res){
      const files = req.files
      posts.create(req.body).then((post) => {
        const fs = require('fs');
        try{
            const filename = post['content'];
            const content = fs.readFileSync(filename).toString();
            post['content'] = content;
        } catch(error){
            console.log(error);
        }
        res.json(post);
    }).catch((error) => {
        res.status(500);
        res.json(error);
    });
});

router.delete('/:id', (req, res) => {
    const postID = Number(req.params.id);
    const result = posts.remove(postID).then((result) => {
        if(result['deletedCount'] == 1){
            res.status(200);
        } else{
            //res.status
        }
        res.redirect('/');
    })
});

router.put('/:id', (req, res) => {
    posts.create(req.body).then((post) => {
        const fs = require('fs');
        
        try{
            const filename = post['content'];
            const content = fs.readFileSync(filename).toString();
            post['content'] = content;
        } catch(error){
            console.log(error);
        }
        res.json(post);
    }).catch((error) => {
        res.status(500);
        res.json(error);
    });
});


module.exports = router;
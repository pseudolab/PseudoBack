const express = require('express');
const router = express.Router();
const posts = require('@db/posts');

/**
* BaseUrl : web.js router에 선언한 BaseUrl을 표시. request url을 쉽게 파악하기 위함
*  : /club
*/

const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');


router.use(morgan('tiny'));
router.use(cors());
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

router.post('/', (req, res) => {
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
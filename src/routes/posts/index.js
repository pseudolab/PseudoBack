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
 
const { exception } = require('console');


router.use(morgan('tiny'));
router.use(cors());
router.use(bodyParser.json());

router.get('/', (req, res) => {
    posts.getAll().then((post) => {
        const fs = require('fs');
        /*
        post.map((value,index,array)=>{
            const filename = value['content'];
            try{
                const content = fs.readFileSync(filename).toString();
                value['content'] = content;
            } catch(error){
            }
        });
        */
        res.json(post);
    });
});

router.get('/:id', (req, res) => {
    const postID = Number(req.params.id);
    posts.get(postID).then((post) => {
        const fs = require('fs');
        console.log(post);
        const filename = post['content'];
        try{
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

        const filename = post['content'];
        try{
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
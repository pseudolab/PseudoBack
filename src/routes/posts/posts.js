const express = require('express');
const router = express.Router();
const posts = require('@db/posts');
//const multiparty = require('multiparty');
const querystring = require('querystring');

/**
* BaseUrl : web.js router에 선언한 BaseUrl을 표시. request url을 쉽게 파악하기 위함
*  : /club
*/

const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

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

router.post('/', (req, res) => {
    
    var body = '';
    req.on('data', function(chunk) { 

      body += chunk;

    });

    req.on('end', function() {
        console.log(body);
        const data = querystring.parse(body, 'name="', '"\r\n\r\n');
        let obj = JSON.parse(JSON.stringify(data));
        
        let output = {};
        Object.keys(obj).forEach((item) => {
            if(obj[item] == null || obj[item] == "") {
                delete obj[item];
            }
            else{
                output[item] = obj[item].replace(/\r\n.*/g,'');
            }
        });

        posts.create(output).then((post) => {
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
    
    /*
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
    */
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
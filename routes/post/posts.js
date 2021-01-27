const express = require('express');
const router = express.Router();
const messages = require('../../db/posts');

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
    messages.getAll().then((message) => {
        const fs = require('fs');

        message.map((value,index,array)=>{
            const filename = value['content'];
            try{
                const content = fs.readFileSync(filename).toString();
                value['content'] = content;
            } catch(error){
            }
        });
        res.json(message);
    });
});

router.post('/:id', (req, res) => {
    //console.log(req.body);
    messages.create(req.body).then((message) => {
        const fs = require('fs');

        const filename = message['content'];
        try{
            const content = fs.readFileSync(filename).toString();
            message['content'] = content;
        } catch(error){
            console.log(error);
        }
        res.json(message);
    }).catch((error) => {
        res.status(500);
        res.json(error);
    });
});


module.exports = router;
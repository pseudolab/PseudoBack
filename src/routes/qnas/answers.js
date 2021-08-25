const express = require('express');
const router = express.Router();
const answers = require('@db/answers');

/**
* BaseUrl : web.js router에 선언한 BaseUrl을 표시. request url을 쉽게 파악하기 위함
*  : /club
*/

const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { requireLogin } = require('@lib');


router.use(morgan('tiny'));
router.use(cors());
router.use(bodyParser.json());


router.get('/:id', (req, res) => {
    const postID = Number(req.params.id);
    answers.get(postID).then((answer) => {
        const fs = require('fs');
        answer.map((value,index,array)=>{
            try{
                const filename = value['content'];
                const content = fs.readFileSync(filename).toString();
                value['content'] = content;
            } catch(error){
            }
        });
        res.json(answer);
    });
});


router.post('/', requireLogin, (req, res) => {
    const payload = req.body;
    payload.userid = req.user.id;
    payload.username = req.user.userName;
    answers.create(payload).then((answer) => {
        const fs = require('fs');

        try{
            const filename = answer['content'];
            const content = fs.readFileSync(filename).toString();
            answer['content'] = content;
        } catch(error){
            console.log(error);
        }
        res.json(answer);
    }).catch((error) => {
        if (error.details) {
            // validation error
            res.status(400).json(error);
        } else {
            // something else
            res.status(500).json(error);
        }
    });
});



module.exports = router;
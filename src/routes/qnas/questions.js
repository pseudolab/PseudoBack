const express = require('express');
const router = express.Router();
const questions = require('@db/questions');

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
    questions.getAll().then((question) => {
        const fs = require('fs');
        res.json(question);
    });
});

router.get('/:id', (req, res) => {
    const questionID = Number(req.params.id);
    questions.get(questionID).then((question) => {
        const fs = require('fs');
        console.log(question);
        try{
            const filename = question['content'];
            const content = fs.readFileSync(filename).toString();
            question['content'] = content;
        } catch(error){
        }
        res.json(question);
    });
});

router.post('/', (req, res) => {
    questions.create(req.body).then((question) => {
        const fs = require('fs');

        try{
            const filename = question['content'];
            const content = fs.readFileSync(filename).toString();
            question['content'] = content;
        } catch(error){
            console.log(error);
        }
        res.json(question);
    }).catch((error) => {
        res.status(500);
        res.json(error);
    });
});



module.exports = router;
const express = require('express');
const router = express.Router();
const replys = require('@db/replys');

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
router.use(bodyParser.json());

router.get('/:id', (req, res) => {
    replys.get(req.params.id).then((reply) => {
        res.json(reply);
    });
});

router.post('/', requireLogin, (req, res) => {
    replys.create(req.body).then((reply) => {
        res.json(reply);
    }).catch((error) => {
        res.status(500);
        res.json(error);
    });
});


module.exports = router;
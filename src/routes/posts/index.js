const express = require('express');
const router = express.Router();

const replysRouter = require('./replys');
const postsRouter = require('./posts');

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

router.use('/', postsRouter);
router.use('/replys',replysRouter);




module.exports = router;
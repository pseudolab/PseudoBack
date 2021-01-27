const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
 
const { exception } = require('console');

const router = express.Router();

router.use(morgan('tiny'));
router.use(cors());
router.use(bodyParser.json());
 
router.get('/', (req, res) => {
    res.json({
        message: 'Behold The MEVN Stack!'
    });
});


module.exports = router;
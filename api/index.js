const express = require('express')
const router = express.Router()
const messages = require('./messages')
const users = require('./users');

router.use('/messages', messages)
router.use('/users', users)

// Add more routes here if you want!
module.exports = router
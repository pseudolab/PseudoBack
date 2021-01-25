const express = require('express')
const router = express.Router()
const messages = require('./messages')
router.use('/messages', messages)
// Add more routes here if you want!
module.exports = router
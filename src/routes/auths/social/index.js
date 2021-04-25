const express=require('express')
const { 
  verifyToken
} = require('./social')

const social = express.Router()

social.post('/token', verifyToken);

module.exports = social

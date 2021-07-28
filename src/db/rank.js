const Joi = require('joi');
const db = require('./connection');

const rankSchema = Joi.object().keys({
  userid: Joi.string().alphanum().required(),
  userPoint: Joi.number().default(0),
});


const Joi = require('joi');
const db = require('./connection');

const statsSchema = Joi.object().keys({
  activeUserCount: Joi.number().default(0),
  UserCount: Joi.number().default(0),
});


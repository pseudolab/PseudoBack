const Joi = require('joi');
const db = require('./connection');
const actions = require('./actions.js');
const _ = require('lodash');
const flat = require('flat');

const allActions = flat.flatten(actions);

// user action history schema
const historySchema = Joi.object({
  userid: Joi.string().required(),
  datetime: Joi.string().isoDate().required(),
  action: Joi.string().allow(allActions).required(),
  content: Joi.any().optional()
});

const history = db.get('history');

async function get(userid) {
  const result = await history.find({ userid });
  return result;
}

async function write(userid, actionPath, contentObj) {
  let item;
  if(contentObj) {
    item = { userid, datetime: new Date() .toISOString(), action: actionPath, content: JSON.stringify(contentObj) };
  }
  else {
    item = { userid, datetime: new Date() .toISOString(), action: actionPath };
  }
  
  // validate schema
  const result = historySchema.validate(item);
  if (result.error) {
    throw new Error(result.error.message);
  }

  return await history.insert(item);
}

async function registerAction(type, func) {
  return async (param) => {
    const res = await func(param);
    if(param.userid) {
      history.write(param.userid, type, param);
    }
    return res;
  };
}

module.exports = {
  get,
  write,
  registerAction
};

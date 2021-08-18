const Joi = require('joi');
const db = require('./connection');

const schema = Joi.object().keys({
    userID: Joi.number().required(),
    userName: Joi.string().min(3).max(40).required(),
    userPoint: Joi.number().default(0),
    userClass: Joi.string().alphanum().default('bronze'),
    isAdmin: Joi.boolean().default(false),
    birth: Joi.number(),
    phone: Joi.number(),
    userMail: Joi.string().email(),
    description: Joi.string().max(300),
    numBoard: Joi.number(),
    numReply: Joi.number(),
    profileImageURL: Joi.string().uri({
        scheme: [
            /https?/
        ]
    })
});
 
const users = db.get('users');

function get(userID){
    return users.findOne({
        id:userID
    });
}
 
module.exports = {
    get
};
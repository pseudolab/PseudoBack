const Joi = require('joi');
const db = require('./connection');

const schema = Joi.object().keys({
    userID: Joi.number().required(),
    userName: Joi.string().alphanum().min(3).max(40).required(),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')).required(),
    repeatPassword: Joi.ref('password'),
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
 
function getAll() {
    return users.find();
}

function get(userID){
    return users.findOne({
        userID
    });
}

function dropAll() {
    return users.drop();
}
 
function create(user) {
    if (!user.userName) user.userName = 'Anonymous';

    const result = schema.validate(user);
    if (result.error == null) {
        const d = new Date();
        user.created = d;
        
        return users.insert(user);
    } else {
        console.error('error');
        return Promise.reject(result.error);
    }
}
 
module.exports = {
    create,
    getAll,
    get,
    dropAll
};
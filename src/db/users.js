const Joi = require('joi');
const db = require('./connection');

const schema = Joi.object().keys({
    userid: Joi.number().required(),
    username: Joi.string().alphanum().min(3).max(40).required(),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    repeatPassword: Joi.ref('password'),
    userpoint: Joi.number().default(0),
    userclass: Joi.string().alphanum().default('bronze'),
    isadmin: Joi.boolean().default(false),
    birth: Joi.number(),
    phone: Joi.number(),
    usermail: Joi.string().email(),
    description: Joi.string().max(300),
    numofboard: Joi.number(),
    numofreply: Joi.number(),
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

function get(userId){
    return users.find({
        userId
    });
}
 
function create(user) {
    if (!user.username) user.username = 'Anonymous';

    //const result = Joi.valid(user, schema);
    const result = schema.validate(user);
    if (result.error == null) {
        const d = new Date();
        user.created = d;
        
        return users.insert(user);
    } else {
        console.log('error');
        return Promise.reject(result.error);
    }
}
 
module.exports = {
    create,
    getAll,
    get
};
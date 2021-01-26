const Joi = require('joi');
const db = require('./connection');

const schema = Joi.object().keys({
    userId: Joi.number().required(),
    username: Joi.string().alphanum().min(3).max(40).required(),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    repeatPassword: Joi.ref('password'),
    birth: Joi.number().optional(),
    phone: Joi.number().optional(),
    email: Joi.string().email().optional(),
    description: Joi.string().max(300).optional(),
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
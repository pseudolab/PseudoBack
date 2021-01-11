const Joi = require('joi');
const db = require('./connection');
 
const schema = Joi.object().keys({
    username: Joi.string().alphanum().required(),
    subject: Joi.string().required(),
    content: Joi.string().max(500).required(),
    imageURL: Joi.string().uri({
        scheme: [
            /https?/
        ]
    })
});
 
const messages = db.get('messages');
 
function getAll() {
    return messages.find();
}
 
function create(message) {
    if (!message.username) message.username = 'Anonymous';

    //const result = Joi.valid(message, schema);
    const result = schema.validate(message);
    if (result.error == null) {
        console.log('done');
        message.created = new Date();
        return messages.insert(message);
    } else {
        console.log('error');
        return Promise.reject(result.error);
    }
}
 
module.exports = {
    create,
    getAll
};
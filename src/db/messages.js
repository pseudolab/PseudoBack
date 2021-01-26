const Joi = require('joi');
const db = require('./connection');
const fs = require('fs');
 
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
        //print(message);
        const fileDir =  './content/';
        const d = new Date();
        message.created = d;

        /* todo: 향후 username 대신 userid로 변경 필요 */
        const contents = message.content;
        filename = message['username'] + d.getFullYear() + ("0" + d.getMonth()+1).slice(-2) + ("0" + d.getDate()).slice(-2)  + ("0" + d.getHours()).slice(-2)  + ("0" + d.getMinutes()).slice(-2)  + ("0" + d.getSeconds()).slice(-2) ;
        message.content = fileDir + filename;
        
        let stream = fs.createWriteStream(fileDir + filename);
        stream.once('open', function(fd) {
            stream.write(contents);
            stream.end();
        });
        
        return messages.insert(message);
    } else {
        console.log('error');
        return Promise.reject(result.error);
    }
}
 
module.exports = {
    create,
    getAll
};;
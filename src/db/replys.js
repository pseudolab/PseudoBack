const Joi = require('joi');
const db = require('./connection');
const fs = require('fs');
 
const schema = Joi.object().keys({
    username: Joi.string().alphanum().required(),
    content: Joi.string().max(500).required(),
    postID: Joi.number().required(),
});
 
const replys = db.get('replys');
 
function get(id) {
    console.log(id);
    return replys.find({"postID":id});
}
 
async function create(reply) {
    if (!reply.username) reply.username = 'Anonymous';

    const result = schema.validate(reply);
    if (result.error == null) {
        const fileDir =  './content/';
        const d = new Date();
        const date = d.getFullYear() + ("0" + (d.getMonth()+1)).slice(-2) + ("0" + d.getDate()).slice(-2)  + ("0" + d.getHours()).slice(-2)  + ("0" + d.getMinutes()).slice(-2)  + ("0" + d.getSeconds()).slice(-2);
        reply.created = date;

        /* todo: 향후 username 대신 userid로 변경 필요 */
        
        
        return replys.insert(reply);
    } else {
        console.log('error');
        return Promise.reject(result.error);
    }
}
 
module.exports = {
    create,
    get
};;
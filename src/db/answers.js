const Joi = require('joi');
const db = require('./connection');
const fs = require('fs');
const counter = require('./counter');
 
const schema = Joi.object().keys({
    userid: Joi.string().alphanum().required(),
    username: Joi.string().alphanum().required(),
    subject: Joi.string().required(),
    content: Joi.string().max(500).required(),
    postID: Joi.number().required(),
});
 
const answers = db.get('answers');
 
function get(id) {
    return answers.find({"postID":id});
}

async function create(answer) {
    if (!answer.username) answer.username = 'Anonymous';

    const result = schema.validate(answer);
    if (result.error == null) {
        const fileDir =  './content/';
        const d = new Date();
        const date = d.getFullYear() + ("0" + (d.getMonth()+1)).slice(-2) + ("0" + d.getDate()).slice(-2)  + ("0" + d.getHours()).slice(-2)  + ("0" + d.getMinutes()).slice(-2)  + ("0" + d.getSeconds()).slice(-2);
        answer.created = date;

        const contents = answer.content;
        filename = answer.userid + date;
        answer.content = fileDir + filename;
        
        let stream = fs.createWriteStream(fileDir + filename);
        stream.once('open', function(fd) {
            stream.write(contents);
            stream.end();
        });

        //const count = await counter.getCounter("answers");
        //answe.postID = count;
        //console.log("testset" + count);
        
        return answers.insert(answer);
    } else {
        console.log('error');
        return Promise.reject(result.error);
    }
}
 
module.exports = {
    create,
    get
};;
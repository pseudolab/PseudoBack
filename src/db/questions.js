const Joi = require('joi');
const db = require('./connection');
const fs = require('fs');
const counter = require('./counter');
 
const schema = Joi.object().keys({
    userid: Joi.string().alphanum().required(),
    subject: Joi.string().required(),
    content: Joi.string().max(500).required(),
});

const questions = db.get('questions');
 
function getAll() {
    return questions.find();
}

function get(id) {
    return questions.findOne({"postID":id});
}
 
async function create(question) {
    const result = schema.validate(question);
    if (result.error == null) {
        const fileDir =  './content/';
        const d = new Date();
        const date = d.getFullYear() + ("0" + (d.getMonth()+1)).slice(-2) + ("0" + d.getDate()).slice(-2)  + ("0" + d.getHours()).slice(-2)  + ("0" + d.getMinutes()).slice(-2)  + ("0" + d.getSeconds()).slice(-2);
        question.created = date;
        
        const contents = question.content;
        filename = question.userid + date;
        question.content = fileDir + filename;
        
        let stream = fs.createWriteStream(fileDir + filename);
        stream.once('open', function(fd) {
            stream.write(contents);
            stream.end();
        });

        const count = await counter.getCounter("questions");
        question.postID = count;
        
        return questions.insert(question);
    } else {
        console.log('error');
        return Promise.reject(result.error);
    }
}
 
module.exports = {
    create,
    getAll,
    get
};;
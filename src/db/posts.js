const Joi = require('joi');
const db = require('./connection');
const fs = require('fs');
const counter = require('./counter');
 
const schema = Joi.object().keys({
    username: Joi.string().alphanum().required(),
    subject: Joi.string().required(),
    content: Joi.string().max(500).required(),
    keyword: Joi.array().items(Joi.string()),
    category: Joi.array().items(Joi.string())
});
 
const posts = db.get('posts');
 
function getAll() {
    return posts.find();
}

function get(id) {
    return posts.findOne({"postID":id});
}
 
async function create(post) {
    if (!post.username) post.username = 'Anonymous';

    const result = schema.validate(post);
    if (result.error == null) {
        const fileDir =  './content/';
        const d = new Date();
        const date = d.getFullYear() + ("0" + (d.getMonth()+1)).slice(-2) + ("0" + d.getDate()).slice(-2)  + ("0" + d.getHours()).slice(-2)  + ("0" + d.getMinutes()).slice(-2)  + ("0" + d.getSeconds()).slice(-2);
        post.created = date;

        /* todo: 향후 username 대신 userid로 변경 필요 */
        const contents = post.content;
        filename = post['username'] + date;
        post.content = fileDir + filename;
        
        let stream = fs.createWriteStream(fileDir + filename);
        stream.once('open', function(fd) {
            stream.write(contents);
            stream.end();
        });

        const count = await counter.getCounter("posts");
        post.postID = count;
        console.log("testset" + count);
        
        return posts.insert(post);
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
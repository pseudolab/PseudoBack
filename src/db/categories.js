const Joi = require('joi');
const db = require('./connection');
 
const schema = Joi.object().keys({
    categoryName: Joi.string().required(),
    cowriter: Joi.array().items(Joi.string())
});
 
const posts = db.get('categories');
 
function getAll() {
    return posts.find();
}

function get(name) {
    return posts.findOne({"categoryName":name});
}
 
function create(category) {
    const result = schema.validate(category);
    return posts.insert(category);
}

function update(name, cowriter) {
    return posts.update({"categoryName":name}, { $set: {"cowriter": cowriter}});
}

function remove(name) {
    return posts.remove({"categoryName":name});
}

module.exports = {
    create,
    getAll,
    get,
    update,
    remove
};
const Joi = require('joi');
const db = require('./connection');
 
const schema = Joi.object().keys({
    categoryName: Joi.string().required(),
    description: Joi.string().required(),
    cowriter: Joi.array().items(Joi.string().alphanum())
});
 
const categories = db.get('categories');
 
function getAll() {
    return categories.find();
}

function get(name) {
    return categories.findOne({"categoryName":name});
}
 
function create(category) {
    const result = schema.validate(category);
    if (result.error == null) {
        return categories.insert(category);
    } else {
        console.log('error');
        return Promise.reject(result.error);
    }
}

function update(name, cowriter) {
    return categories.update({"categoryName":name}, { $set: {"cowriter": cowriter}});
}

function remove(name) {
    return categories.remove({"categoryName":name});
}

module.exports = {
    create,
    getAll,
    get,
    update,
    remove
};
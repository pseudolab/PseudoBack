// models/Counter.js
const Joi = require('joi');
const db = require('./connection');

// schema
/*
const counterSchema = Joi.object().keys({
    _id: Joi.object(),
    name:Joi.string().valid( 'posts' ).required(),
    count:Joi.number().default(1),
});
*/
const counter = db.get('counter');
 
async function getCounter(name) {
    //let count = await counter.findOne({"name":name});
    let count = await counter.findOne({"name":name});
    if (!count){
        count = await counter.insert({"name":name, "count":0});
    }
    const c = count.count+1;
    //console.log(count);
    //console.log(c);

    try{
        let test = await counter.update({"name":name}, { $set: {"count": c}});
    }
    catch(exception){
        console.log(exception);
    }
    return count.count;
}

module.exports = {getCounter};
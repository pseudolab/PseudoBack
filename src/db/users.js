const Joi = require('joi');
const db = require('./connection');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

const baseSchema = Joi.object().keys({
    id: Joi.string().required(),
    userName: Joi.string().alphanum().min(3).max(40).required(),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')).required(),
    repeatPassword: Joi.ref('password'),
    userPoint: Joi.number().default(0),
    userClass: Joi.string().alphanum().default('bronze'),
    isAdmin: Joi.boolean().default(false),
    birth: Joi.number(),
    phone: Joi.number(),
    userMail: Joi.string().email(),
    description: Joi.string().max(300),
    numBoard: Joi.number(),
    numReply: Joi.number(),
    profileImageURL: Joi.string().uri({
        scheme: [
            /https?/
        ]
    })
});

const googleEmail = Joi.object().keys({
  value: Joi.string(),
  verified: Joi.bool()
}) 

const googleProfileSchema = baseSchema.append({
  displayName: Joi.string(),
  emails: Joi.array().items(googleEmail),
  photos: Joi.array(),
  provider: 'google',
  _raw: Joi.any(),
  _json: Joi.any(),
  userID: Joi.number().unsafe(),
  refreshToken: Joi.any(),
  accessToken: Joi.any(),
})

const localProfileSchema = baseSchema.append({
})

const schemas = {
  google: googleProfileSchema,
  local: localProfileSchema  
}
 
const users = db.get('users');
 
function getAll() {
    return users.find();
}

function get(userID){
    return users.findOne({
        id: userID
    });
}

function findByEmail(user){
  return users.findOne({
    userMail: user.userMail
  })
}

function dropAll() {
    return users.drop();
}
 
async function create(user) {
    if (!user.userName) user.userName = 'Anonymous';
    const socialType = user.provider || 'local'
    console.info('user socialType: ', socialType)
    const schema = schemas[socialType]
    if(socialType==='google'){
      user.userName = user.userName || user.displayName
      user.userMail = user.emails[0].value
    }

    const before = await findByEmail(user)
    console.debug(before)
    if(before){
      console.info('user is not null, not creating')
      return before
    } else {
      console.info('creating new user')
    }
    
    const result = schema.validate(user);
    if (result.error == null) {
        const d = new Date();
        user.created = d;
        
        return users.insert(user);
    } else {
        console.error('error');
        throw result.error;
    }
}

async function findById(id){
  return users.findOne({
    id: id
  });
}

async function findByEmail(email){
  return users.findOne({
    userMail: email
  }) 
}

async function findByGoogleId(userID){
  return await users.findOne({
    userID: userID
  });
}

module.exports = {
    create,
    getAll,
    get,
    dropAll,
    findById,
    findByEmail,
    findByGoogleId,
};
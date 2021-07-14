const Joi = require('joi');
const db = require('./connection');

const baseSchema = Joi.object().keys({
    id: Joi.string().alphanum().required(),
    userName: Joi.string().min(3).max(40).required(),
    userPoint: Joi.number().default(0),
    userClass: Joi.string().alphanum().default('bronze'),
    isAdmin: Joi.boolean().default(false),
    birth: Joi.number(),
    phone: Joi.number(),
    userMail: Joi.string().email().required(),
    description: Joi.string().max(300),
    numBoard: Joi.number(),
    numReply: Joi.number(),
    profileImageURL: Joi.string().uri({
        scheme: [
            /https?/
        ]
    }),
    provider: Joi.string().valid('google', 'local'),
});

// const Gmail = Joi.object().keys({
//     value: Joi.string().email(),
//     verified: Joi.bool()
// });

// const googleRawProfileSchema = Joi.object().keys({
//     displayName: Joi.object().keys({
//         value: Joi.string().required()
//     }).required(),
//     emails: Joi.array().items(Gmail).required(),
//     photos: Joi.array(),
//     provider: 'google',
//     _raw: Joi.any(),
//     _json: Joi.any(),
//     userID: Joi.any().required(),
//     refreshToken: Joi.any(),
//     accessToken: Joi.any(),
// });

const googleProfileSchema = Joi.object().keys({
    provider: 'google',
    photo: Joi.string(),
    userID: Joi.any().required(),
});

const localProfileSchema = Joi.object().keys({
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')).required(),
    repeatPassword: Joi.ref('password'),
});

const schemas = {
    google: baseSchema.concat(googleProfileSchema),
    local: baseSchema.concat(localProfileSchema)
};
 
const users = db.get('users');
    
function getAll() {
    return users.find();
}

function get(id){
    return users.findOne({
        id
    });
}

function dropAll() {
    return users.drop();
}

async function findById(id) {
    return users.findOne({
        id
    });
}

async function findByEmail(email) {
    return users.findOne({
        userMail: email
    });
}

async function findByUserName(userName) {
    return users.findOne({
        userName
    })
}

async function findByGoogleId(userID){
    return await users.findOne({
        userID: userID
    });
}

// TOOD: validationError와 동작 에러 구별
async function create(user) {
    const socialType = user.provider || 'local';
    const schema = schemas[socialType];

    if (socialType === 'local') {
        if (!user.userName) user.userName = 'Anonymous';
    } else if(socialType==='google'){
        // // when using raw google profile schema
        // const result = googleProfileSchema.validate(user, {
        //     allowUnknown: true
        // });

        // if (result.error) {
        //     throw result.error;
        // }
        
        // user.id = user.userID + '';
        // user.userName = user.displayName.value;
        // user.userMail = user.emails[0].value;

        // when using extracted google profile schema
        const result = googleProfileSchema.validate(user, {
            allowUnknown: true
        });

        if (result.error) {
            throw result.error;
        }
        
        user.id = user.userID + '';
    }

    const exists = await findByEmail(user.userMail) || await findByUserName(user.userName);

    if (exists) {
        exists.exists = true;
        return exists;
    }
    
    const result = schema.validate(user);
    if (result.error == null) {
        const d = new Date();
        user.created = d;
        
        return users.insert(user);
    } else {
        throw result.error;
    }
}
 
module.exports = {
    create,
    getAll,
    get,
    dropAll
};
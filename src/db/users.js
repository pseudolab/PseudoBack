const Joi = require('joi');
const db = require('./connection');

const baseSchema = Joi.object({
    id: Joi.string().alphanum().required(),
    isAdmin: Joi.boolean().default(false),
    // TODO: Add default image file
    // TODO: move to profile schema
    provider: Joi.string().valid('google', 'local'),
});

const profileSchema = Joi.object({
    userName: Joi.string().min(3).max(40),
    birth: Joi.number(),
    phone: Joi.number(),
    description: Joi.string().max(400).default(''),
    region: Joi.string().max(100).default(''),
    userMail: Joi.string().email(),
    github: Joi.string().max(100).default(''),
    linkedIn: Joi.string().max(100).default(''),
    facebook: Joi.string().max(100).default(''),
    googleScholar: Joi.string().max(100).default(''),
    website: Joi.string().max(100).default(''),
    profileImageURL: Joi.string().uri({
        scheme: [
            /https?/
        ],
        allowRelative: true
    }),
});

// TODO: refer separate study schema
const studySchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    followerCount: Joi.number().required(),
})

const rankRecord = Joi.object({
    rank: Joi.number().default(0),
    userCount: Joi.number().default(0)
}).default()

const userActivity = Joi.object({
    date: Joi.date().required(),
    count: Joi.number().required()
})

// TODO: profiles 쪽으로 분리하기
const userStatsSchema = Joi.object({
    userPoint: Joi.number().default(0),
    userClass: Joi.string().alphanum().default('bronze'),
    rankInfo: Joi.object({
        currentRank: rankRecord,
        highestRank: rankRecord
    }).default(),
    numBoard: Joi.number().default(0),
    numReply: Joi.number().default(0),
    activity: Joi.object({
        post: Joi.number().default(0),
        vote: Joi.number().default(0),
        comment: Joi.number().default(0),
        study: Joi.number().default(0),
        answer: Joi.number().default(0),
        question: Joi.number().default(0)
    }).default(),
    followingStudy: Joi.array().items(studySchema).default([]),
    activityHistory: Joi.array().items(userActivity).default([])
})

const googleProfileSchema = Joi.object({
    provider: 'google',
    photo: Joi.string(),
    userID: Joi.any().required(),
});

const localProfileSchema = Joi.object({
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')).required(),
    repeatPassword: Joi.ref('password'),
});

const schemas = {
    google: baseSchema.concat(googleProfileSchema).concat(profileSchema),
    local: baseSchema.concat(localProfileSchema).concat(profileSchema)
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
        
        const userStats = userStatsSchema.validate({}).value;

        user.stats = userStats;
        
        return users.insert(user);
    } else {
        console.error(result.error);
        throw result.error;
    }
}

async function updateProfileImageURL(user, profileImageURL) {
    // validate user
    const userSchema = schemas[user.provider];
    const result = userSchema.validate(user, {
        allowUnknown: true
    });
    
    if (result.error) {
        throw result.error;
    }

    // update user using monk
    const update = {
        $set: {
            profileImageURL
        }
    };
    return users.update({
        id: user.id
    }, update);
}

async function updateStats(user, statinfo) {
    const statsValidation = userStatsSchema.validate(statinfo);
    // handle validation error
    if (statsValidation.error) {
        console.error(statsValidation.error);
        throw statsValidation.error;
    }
    const userStats = statsValidation.value;

    user.stats = userStats;
    return users.update({
        id: user.id
    }, {
        $set: user
    });
}

module.exports = {
    create,
    getAll,
    get,
    dropAll,
    updateStats,
    updateProfileImageURL,
};
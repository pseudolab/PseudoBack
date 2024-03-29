const Joi = require('joi');
const db = require('./connection');
const monk = require('monk');
const _ = require('lodash');
const config = require('config');

const DEFAULT_PROFILE_IMAGE_PATH = config.get('DEFAULT_PROFILE_IMAGE_PATH');

const baseSchema = Joi.object({
    id: Joi.string().required(),
    isAdmin: Joi.boolean().default(false),
    // TODO: Add default image file
    // TODO: move to profile schema
    provider: Joi.string().valid('google', 'local'),
});

// TODO: move to util
const getStringValidation = (maxlen) => Joi
    .string()
    .max(maxlen)
    .allow('')
    .default('');

const profileSchema = Joi.object({
    userName: Joi.string().min(3).max(40),
    userMail: Joi.string().email(),
    birth: Joi.number(),
    phone: Joi.number(),
    description: getStringValidation(400),
    region: getStringValidation(100),
    github: getStringValidation(100),
    linkedIn: getStringValidation(100),
    facebook: getStringValidation(100),
    googleScholar: getStringValidation(100),
    website: getStringValidation(100),
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
    userID: Joi.any().required(),
    userName: Joi.string().required(),
    userMail: Joi.string().email().required(),
    photo: Joi.string(),
});

const localProfileSchema = Joi.object({
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')).required(),
    repeatPassword: Joi.ref('password'),
});

const schemas = {
    google: baseSchema.concat(profileSchema).keys({
        google: googleProfileSchema,
        stats: userStatsSchema.default()
    }),
    local: baseSchema.concat(profileSchema).concat(localProfileSchema).keys({
        stats: userStatsSchema.default()
    })
};

const users = db.get('users');

function getAll() {
    return users.find();
}

function get(id){
    return users.findOne({
        "id":id
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
        const result = googleProfileSchema.validate(user.google, {
            allowUnknown: true
        });

        if (result.error) {
            throw result.error;
        }

        // merge if not null
        _.mergeWith(user, {
            userName: user.google.userName,
            userMail: user.google.userMail,
            profileImageURL: user.google.photo,
        }, (a, b) => b === null ? a : undefined);
    }

    const exists = await findByEmail(user.userMail) || await findByUserName(user.userName);

    if (exists) {
        exists.exists = true;
        return exists;
    }

    // use custom 'id' field (다른 라우트에서 사용)
    // NOTE: 내장 '_id' 사용?
    const newId = await monk.id() + '';
    user.id = newId;

    user.profileImageURL = user.profileImageURL || DEFAULT_PROFILE_IMAGE_PATH;
    
    const result = schema.validate(user);
    if (result.error == null) {
        user = result.value;

        const d = new Date();
        user.created = d;

        return users.insert(user);
    } else {
        console.error(result.error);
        throw result.error;
    }
}

// use profileSchema
async function updateProfiles(userid, profile) {
    const user = await findById(userid);
    if (!user) {
        throw new Error('User not found');
    }

    const result = profileSchema.validate(profile, {
        presence: 'optional',
        // prevent default value overwritting exist value
        noDefaults: true,
        // prevent unknown fields
        stripUnknown: true
    });

    if (result.error == null) {
        const d = new Date();
        profile.updated = d;

        // merge if null in user
        _.mergeWith(user, result.value, (a, b) => {
            if (b === null) return a;
            return b;
        });

        return users.update({
            id: userid
        }, {
            $set: user
        });
    } else {
        console.error(result.error);
        return result.error;
    }
}

async function updateProfileImageURL(user, profileImageURL) {
    updateProfile(user, 'profileImageURL', profileImageURL);
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
    updateProfiles,
    updateProfileImageURL,
};
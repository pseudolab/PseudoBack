const Joi = require('joi');
const db = require('./connection');
const history = require('./actionHistory');

const baseSchema = Joi.object({
    id: Joi.string().alphanum().required(),
    userName: Joi.string().min(3).max(40).required(),
    isAdmin: Joi.boolean().default(false),
    birth: Joi.number(),
    phone: Joi.number(),
    userMail: Joi.string().email().required(),
    description: Joi.string().max(300).default(''),
    // TODO: Add default image file
    profileImageURL: Joi.string().uri({
        scheme: [
            /https?/
        ]
    }),
    provider: Joi.string().valid('google', 'local'),
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

// const Gmail = Joi.object({
//     value: Joi.string().email(),
//     verified: Joi.bool()
// });

// const googleRawProfileSchema = Joi.object({
//     displayName: Joi.object({
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

// get user point using updateStats function
async function getUserPoint(userId) {
    const user = await users.findOne({
        id: userId
    });

    if (user) {
        return user.stats.userPoint;
    }

    return -1;
}

// update user point using updateStats function
async function updateUserPoint(userId, point) {
    const user = await users.findOne({
        id: userId
    });
    await updateStats(user, {
        ...user.stats,
        userPoint: point
    });
}

function updateRankInfo(user, statInfo) {
    const {
        currentRank,
        highestRank
    } = statInfo;

    if (currentRank) {
        user.stats.rankInfo.currentRank = currentRank;
    }

    if (highestRank) {
        user.stats.rankInfo.highestRank = highestRank;
    }
}

// TODO: separate to a file
// define user class point ranges
const userClassPoints = {
    bronze: 0,
    silver: 500,
    gold: 1500,
    platinum: 5000,
    diamond: 20000,
};
// apply business rules of statinfo
function updateStatsInfo(user) {
    const userActionHistory = history.get(user.id);
    console.log('HISTORY', userActionHistory);
    const rankinfo = {
        currentRank: user.stats.rankInfo.currentRank,
        highestRank: user.stats.rankInfo.highestRank
    };

    const userPoint = user.stats.userPoint;

    // user.stats.userPoint = userPoint;
    // updateRankInfo(user, rankInfo);
    // user.stats.numBoard = numBoard;
    // user.stats.numReply = numReply;
    // user.stats.activity = activity;
    // user.stats.followingStudy = followingStudy;
    // user.stats.activityHistory = activityHistory;

    // update userclass based on user point using userClassPoints
    const userClass = Object.keys(userClassPoints)
        .filter((key) => userPoint >= userClassPoints[key])
        .pop();

    // detect if user class changed
    if (user.stats.userClass !== userClass) {
        user.stats.userClass = userClass;
        // notify user class change
        // TODO: WORK FROM HERE
        
        
    }

    user.stats.userClass = userClass;
}


async function updateStats(user, statinfo) {
    console.info('updateing user stats');
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
    updateUserPoint,
    updateStats,
    getUserPoint
};
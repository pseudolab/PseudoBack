const dev = require('express').Router();
const db = require('@db/users');
const post = require('@db/posts');
const faker = require('faker');

dev.get('/check', (req, res) => {
  console.info('check call');
  res.sendStatus(200);
})

dev.get('/create-user', async (req,res)=>{
  console.warn('create new user');
  await db.dropAll();
  const response = await db.create({
    provider: 'google',
    id: 'uid1',
    userMail: 'asd@asd.com',
    userID: 'uid1',
    userName: 'Epikem'
  });

  console.log(response);

  res.status(200).json(response);
})

function getFakeActivity() {
  const activity = {
    post: faker.datatype.number({ min: 1, max: 100 }),
    vote: faker.datatype.number({ min: 1, max: 100 }),
    comment: faker.datatype.number({ min: 1, max: 100 }),
    study: faker.datatype.number({ min: 1, max: 100 }),
    answer: faker.datatype.number({ min: 1, max: 100 }),
    question: faker.datatype.number({ min: 1, max: 100 })
  };
  return activity;
}

function getFakeStudyList(count) {
  const list = [];
  for (let i = 0; i < count; i++) {
    list.push({
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      followerCount: faker.datatype.number({ min: 1, max: 100 })
    });
  }
  return list;
}

function getFakeActivityList(count) {
  const list = [];
  for (let i = 0; i < count; i++) {
    list.push({
      date: faker.date.recent(),
      count: faker.datatype.number({ min: 1, max: 10 })
    });
  }
  return list;
}

dev.get('/update-user-stats', async (req,res)=>{
  console.warn('update user stats');
  const tempUserStats = getFakeUserStats();

  const user = await db.get('uid1');

  if(user){
    const updateResult = await db.updateStats(user, tempUserStats);
    console.log(updateResult);
    res.status(200).json(updateResult);
  }
  else{
    res.status(200).json({
      error: 'user not found'
    });
  }
})

function getFakeRankInfo() {
  const rankInfo = {
    currentRank: {
      rank: faker.random.number({ min: 1, max: 100 }),
      userCount: faker.random.number({ min: 1, max: 10000 })
    },
    highestRank: {
      rank: faker.random.number({ min: 1, max: 100 }),
      userCount: faker.random.number({ min: 1, max: 10000 })
    }
  };
  return rankInfo;
}

function getFakeClass() {
  const userClass = faker.random.arrayElement(['bronze', 'silver', 'gold', 'platinum', 'diamond']);
  return userClass;
}

function getFakeUserStats() {
  const userStats = {
    userPoint: faker.random.number({ min: 1, max: 100 }),
    userClass: getFakeClass(),
    rankInfo: getFakeRankInfo(),
    numBoard: faker.random.number({ min: 1, max: 100 }),
    numReply: faker.random.number({ min: 1, max: 100 }),
    activity: getFakeActivity(),
    // fill some data
    followingStudy: getFakeStudyList(5),
    // fill some data
    activityHistory: getFakeActivityList(faker.random.number({ min: 10, max: 35 }))
  };
  return userStats;
}

dev.get('/update-my-stats', async (req,res)=>{
  console.warn('updated your user stats with faker');
  const fakeUserStats = getFakeUserStats();

  const myid = await db.get(req.user.id);

  if(myid){
    const updateResult = await db.updateStats(myid, fakeUserStats);
    console.log(updateResult);
    res.status(200).json(updateResult);
  }
  else{
    res.status(200).json({
      error: 'user not found'
    });
  }
})


dev.get('/reset', async (req,res)=>{
  console.warn('DROP ALL USERS');
  
  await db.dropAll();
  res.sendStatus(203);
  
})

dev.get('/create-post', async (req,res)=>{
  console.warn('create new post');
  const response = await post.create(getFakePost());
  res.status(200).json(response);
});

function getFakePost(userid) {
  const post = {
    userid,
    username: faker.name.findName(),
    subject: faker.lorem.sentence(),
    content: faker.lorem.paragraph(),
    keyword: faker.lorem.words(3),
    cowriter: faker.name.findName(),
    category: faker.lorem.words(3)
  };
  return post;
}

dev.get('/create-my-post', async (req,res)=>{
  console.warn('create new post');
  const response = await post.create(getFakePost(req.user.id));
  res.status(200).json(response);
});

module.exports = dev;
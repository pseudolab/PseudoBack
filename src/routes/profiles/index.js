const router = require('express').Router();
const db = require('@db/profiles');
const users = require('@db/users');
const requireLogin = require('@lib').requireLogin;
const multer = require('multer');
const path = require('path');
const config = require('config');

// 프로필 편집 기능 제공. 프로필 조회 기능은 유저 정보에 포함되므로 필요하지 않음

const ProfileImageBasePath = 'images';
const Host = config.get('HOST') || 'localhost';
const Port = config.get('PORT') || 4000;

const multerConfig = {
  storage: multer.diskStorage({
  destination: function (req, file, next) {
    next(null, ProfileImageBasePath);
  },
  // TODO: validate path, check success
  filename: function (req, file, next) {
    const imagePath = `profile_${req.user.userName}_${file.originalname}`;
    req.user.profileImageURL = path.join(ProfileImageBasePath, imagePath);
    next(null, imagePath);
  }
 })
};

router.get('/my', requireLogin, async (req, res) => {
  // requireLogin registers req.user
  const myProfile = req.user;

  res.json(myProfile);
});

router.put('/my', requireLogin, async (req, res) => {
  const user = req.user;
  const profiles = req.body;

  const result = await users.updateProfiles(user.id, profiles);
  if (result.ok) {
    res.json({
      res: 'success'
    });
  }
});

// retrieve my profile image
router.get('/image', requireLogin, async (req, res) => {
  const user = req.user;
  const image = await db.getImage(user.id);
  res.json(image);
});

// change user's profile image using multer
// TODO: handle user's image name with care (use hash?)
router.post('/image', requireLogin, multer(multerConfig).single('image'), async (req, res) => {
  console.info('got image POST', req.body);

  const user = req.user;
  const profileImageURL = `http://${Host}:${Port}/${req.file.path}`;
  
  users.updateProfileImageURL(user, profileImageURL);
  
  res.json({
    res: 'success'
  })
});

router.get('/:userID', async (req, res) => {
  const userID = req.params.userID;
  const foundUser = await db.get(userID);

  if(!foundUser) {
    console.warn('user not found')
    res.sendStatus(404);
    return;
  }

  res.json(foundUser);
}); 

module.exports=router;

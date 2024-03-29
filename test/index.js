require('module-alias/register');

const chai = require('chai')
const expect = require('chai').expect
const usersDB = require('@db/users');
const _ = require('lodash');
const config = require('config');

chai.use(require('chai-http'))

const USE_FAKE_LOGIN = config.get('USE_FAKE_LOGIN')
const port = config.get('PORT');

// apply global header to all requests
const header = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
}

// chai with a custom header


const fixture = {
  new_user_profile: {
    description: 'new user description',
    region: 'new user region',
    github: 'new user github',
    linkedIn: 'new user linkedIn',
    facebook: 'new user facebook',
    googleScholar: 'new user googleScholar',
    website: 'new user website',
  },
}

describe('pseudo-back', ()=>{
  let server
  before('start', () => {
    server = require('@root').server;

    // TODO: clean-up db
    usersDB.dropAll();
  })
  
  describe('server', ()=>{
    it('should be listening on a specified port', ()=>{
      expect(server.address().port).to.equal(port)
    })
  })

  if (USE_FAKE_LOGIN) {
    describe('users profile api', ()=>{
      it('should return a user profile with google profile', async ()=>{
        const response = await chai.request(server)
          .get('/routes/profiles/my')
          .set(header)
        
        expect(response).to.have.status(200)

        const profile = response.body
        const google = profile.google

        expect(profile).to.have.property('google')
        expect(google).to.have.property('userID')
        expect(google).to.have.property('userName')
        expect(google).to.have.property('userMail')
      })

      const new_profile = fixture.new_user_profile;

      it(`should able to update my profile`, async ()=>{
        const response = await chai.request(server)
          .put('/routes/profiles/my/')
          .send({ ...new_profile })
          .set(header)
        
        expect(response).to.have.status(200)
        expect(response.body).to.deep.equal({ res: 'success' })
      })

      it(`should return my profile with updated profile`, async ()=>{
        const response = await chai.request(server)
          .get('/routes/profiles/my')
          .set(header)
        
        const profile = response.body
        
        expect(response).to.have.status(200)
        expect(profile).to.include.keys(new_profile)
      })
    })

    describe('qna api', ()=>{
      it('should handle post answer', async ()=>{
        const response = await chai.request(server)
          .post('/routes/qnas/answers')
          .send({
            subject: 'test',
            content: 'test content',
            postID: 123,
          })
          .set(header)

        // console.log(response.body)

        // TODO: post db 초기화 추가
        expect(response).to.have.status(200)
        expect(response.body).to.have.property('created')
      })
    })
  } else {
    // describe('users local old api', ()=>{
    //   it('post / should create a user', async ()=>{
    //     const response = await chai.request(server).post('/routes/users').send({
    //       "userName": "username1",  // TODO: use fixture
    //       "userID": 12314232323,
    //       "password": "samplePassword"
        
    //     });
    //     console.log('created', response.body)
    //     expect(response.body).to.exist
    //   })    

    //   it('get / should return users', async ()=>{
    //     const response = await chai.request(server).get('/routes/users');
    //     expect(response.body).to.have.length.gte(1)
    //   })

    //   it('get /:id should return a user', async ()=>{
    //     const response = await chai.request(server).get('/routes/users/12314232323');
    //     console.log(response.body)
    //     expect(response.body.userID).equals(12314232323)
    //     // password should be hashed
    //     expect(response.body.password).not.equal("samplePassword")
    //   })
    // })
  }

  after('end', ()=>{
    server.close()
  })
})
require('module-alias/register');

const chai = require('chai')
const expect = require('chai').expect
const port = 4000;  // TODO: use config
const usersDB = require('@db/users');

chai.use(require('chai-http'))

describe('pseudo-back', ()=>{
  let server
  let agent
  before('start', () => {
    server = require('@root').server;
    agent = chai.request()

    // TODO: clean-up db
    usersDB.dropAll();
  })
  
  describe('server', ()=>{
    it('should be listening on a specified port', ()=>{
      expect(server.address().port).to.equal(port)
    })    
  })

  describe('users api', ()=>{
    it('post / should create a user', async ()=>{
      const response = await chai.request(server).post('/api/users').send({
        "userName": "username1",  // TODO: use fixture
        "userID": 12314232323,
        "password": "samplePassword"
      
      });
      console.log('created', response.body)
      expect(response.body).to.exist
    })    

    it('get / should return users', async ()=>{
      const response = await chai.request(server).get('/api/users');
      expect(response.body).to.have.length.gte(1)
    })

    it('get /:id should return a user', async ()=>{
      const response = await chai.request(server).get('/api/users/12314232323');
      console.log(response.body)
      expect(response.body.userID).equals(12314232323)
      // password should be hashed
      expect(response.body.password).not.equal("samplePassword")
    })
  })

  after('end', ()=>{
    server.close()
  })
})
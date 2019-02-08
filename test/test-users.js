const chai = require('chai');
const chaiHttp = require('chai-http');


const expect = chai.expect;

const {app, runServer, closeServer} = require('../app');
const {User} = require('../models/User');
const {mongoURI} = require('../config/database');

chai.use(chaiHttp);


describe('API - Users', function () {

  before(function () {
    return mongoose.connect(mongoURI)
      .then(() => Promise.all([
        User.deleteMany()
      ]));
  });

  beforeEach(function () {
    return Promise.all([
      User.insertMany(users),
      User.createIndexes()
    ]);
  });

  afterEach(function () {
    sandbox.restore();
    return Promise.all([
      User.deleteMany()
    ]);
  });


  after(function () {
    return mongoose.disconnect();
  });

  describe('POST /api/users', function () {
    it('should create a new user when provided valid username, password, and fullName', function () {
      const newUser = {
        name: 'Test User',
        username: 'testuser',
        password: 'password'
      };
      let res;
      return chai.request(app)
        .post('/users/register')
        .send(newUser)
        .then(_res => {
          res = _res;
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.all.keys('id', 'name', 'email', 'password');
          expect(res.body.id).to.exist;
          expect(res.body.name).to.equal(newUser.name);
          
          return User.findById(res.body.id);
        })
        .then(data => {
          expect(data).to.exist;
          expect(res.body.id).to.equal(data.id);
          expect(res.body.name).to.equal(data.name);
          expect(res.body.email).to.equal(data.email);
          return data(newUser.password);
        })
        .then(isValid => {
          expect(isValid).to.be.true;
        });
    });

    

    it('should reject users with missing username', function () {
      const newUser = {
        password: 'password'
      };
      return chai.request(app)
        .post('/users/register')
        .send(newUser)
        .then(res => {
          expect(res).to.have.status(422);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.equal('Missing \'username\' in request body');
        });
    });

    it('should reject users with missing password', function () {
      const newUser = {
        name: 'testuser'
      };
      return chai.request(app)
        .post('/users/register')
        .send(newUser)
        .then(res => {
          expect(res).to.have.status(422);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.equal('Missing \'password\' in request body');
        });
    });

    it('should reject users with empty username', function () {
      const newUser = {
        username: '',
        password: 'password'
      };
      return chai.request(app)
        .post('/users/register')
        .send(newUser)
        .then(res => {
          expect(res).to.have.status(422);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.code).to.equal(422);
          expect(res.body.reason).to.equal('ValidationError');
          expect(res.body.message).to.equal('Must be at least 1 characters long');
          expect(res.body.location).to.equal('username');
        });
    });

    it('should reject users with password less than 8 characters', function () {
      const newUser = {
        username: 'testuser',
        password: '1234567'
      };
      return chai.request(app)
        .post('/users/register')
        .send(newUser)
        .then(res => {
          expect(res).to.have.status(422);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.code).to.equal(422);
          expect(res.body.reason).to.equal('ValidationError');
          expect(res.body.message).to.equal('Must be at least 8 characters long');
          expect(res.body.location).to.equal('password');
        });
    });

    it('should reject users with duplicate username', function () {
      return User.findOne()
        .then(data => {
          const newUser = {
            username: data.username,
            password: 'password'
          };
          return chai.request(app).post('/users/register').send(newUser);
        })
        .then(res => {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.equal('Username already exists');
        });
    });

    
    it('should catch errors and respond properly', function () {
      sandbox.stub(User.schema.options.toJSON, 'transform').throws('FakeError');

      const newUser = {
        name: 'Test User',
        password: 'password'
      };

      return chai.request(app)
        .post('/users/register')
        .send(newUser)
        .then(res => {
          expect(res).to.have.status(500);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.equal('Internal Server Error');
        });
    });
  });
});

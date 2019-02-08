const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require("mongoose");

const expect = chai.expect;

const {Resolution} = require('../models/Resolution');
const {app, runServer, closeServer} = require('../app');
const {mongoURI} = require('../config/database');

chai.use(chaiHttp);

function seedResolutions() {
    console.info('seeding resolution data');
    const resolutionData = [];
    for (i=0; i<10; i++) {
        seedData.push(generateResolutionData());
    }
    return Resolution.insertMany(seedData);
}

function generateResolutionData() {
    return {
        title: faker.lorem.sentence(),
        body: faker.lorem.sentences(),
        date: faker.date.past(),
        status: faker.lorem.sentence()
    };
}

function tearDownDb() {
    console.warn("Deleting database");
    return mongoose.connection.dropDatabase();
}

describe("Resolution API resource",() => {
	before(function () {
    return mongoose.connect(mongoURI)
      .then(() => Promise.all([
        Resolution.deleteMany()
      ]));
  });

  beforeEach(function () {
    return Promise.all([
      Resolution.insertMany(users),
      Resolution.createIndexes()
    ]);
  });

  afterEach(function () {
    sandbox.restore();
    return Promise.all([
      Resolution.deleteMany()
    ]);
  });


  after(function () {
    return mongoose.disconnect();
  });
    });
    describe("GET endpoint", () =>{
        it('should return all existing resolutions', () =>{
            let res;
            return chai.request(app)
                .get('/resolutions')
                .then((_res) => {
                    res=_res;
                    expect(res.body).to.have.lengthOf.at.least(1);
                    return Resolution.count();
                })
                .then((count) =>{
                    expect(res.body).to.have.lengthOf(count);
                });
        });
        it('should return posts with the right fields', () => {
            let resRes;
            return chai.request(app)
                .get('/resolutions')
                .then((res) =>{
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a('array');
                    expect(res.body).to.have.lengthOf.at.least(1);
                    res.body.forEach((blog) => {
                    	expect(blog).to.be.a('object');
                    	expect(blog).to.include.keys(
          			'title', 'body', 'status', 'date');
            });
            resRes= res.body[0];
            return Resolution.findById(resRes.id)
    })
    .then((resolution) =>{
        expect(resRes.title).to.equal(resolution.title);
        expect(resRes.body).to.equal(resolution.body);
        expect(resRes.status).to.equal(resolution.status);
        expect(resRes.id).to.equal(resolution.id);
    });
});
})
describe("POST endpoint", () => {
    it("should add a new resolution", () =>{
        const newRes = generateResolutionData();
        return chai.request(app)
					.post('/resolutions')
					.send(newRes)
					.then((res) =>{
						expect(res).to.have.status(201);
						expect(res.body).to.be.a('object');
          	expect(res.body).to.include.keys(
						'title', 'body', 'status', 'updates');
						expect(res.body.id).to.not.be.null;
						expect(res.body.title).to.equal(newRes.title);
						expect(res.body.body).to.equal(newRes.body);
						expect(res.body.status).to.equal(newRes.status);
						expect(res.body.updates).to.equal(newRes.updates);
						return Resolution.findById(res.body.id);
					})
					.then((resolution) =>{
						expect(resolution.title).to.equal(newRes.title);
						expect(resolution.body).to.equal(newRes.body);
						expect(resolution.status).to.equal(newRes.status);
						expect(resolution.updates).to.equal(newRes.updates);
					});
    });
});

describe("PUT endpoint", () => {
	it('should update fields you send over', () => {
		const updateData = {
			title: "fefefefefe",
			body: "jajajajajaja",
			status: "Complete"
		};

		return Resolution
			.findOne()
			.then((resolution) => {
				updateData.id = resolution.id;

				return chai.request(app)
					.put(`/resolutions/${resolution.id}`)
					.send(updateData);
			})
			.then((res) => {
				expect(res).to.have.status(204);
				return Resolution.findById(updateData.id);
			})
			.then((reso) => {
				expect(reso.title).to.equal(updateData.title);
				expect(reso.body).to.equal(updateData.body);
				expect(reso.status).to.equal(updateData.status);
			});
	});
});
describe("DELETE endpoint", () => {
	it('delete a restaurant by id', function() {

	let resolution;
		return Resolution
			.findOne()
			.then((_resolution) => {
				resolution = _resolution; 
				return chai.request(app).delete(`/resolutions/${resolution.id}`);
			})
			.then(function(res) {
				expect(res).to.have.status(204);
				return Resolution.findById(resolution.id);
			})
			.then(function(deletedRes) {
				expect(deletedRes).to.be.null;
			});
	});
})



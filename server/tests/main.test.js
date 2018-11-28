const request = require('supertest-as-promised');
const httpStatus = require('http-status');
const chai = require('chai'); // eslint-disable-line import/newline-after-import
const expect = chai.expect;
const app = require('../index');

chai.config.includeStack = true;

describe('## Main tests', () => {


  describe('# GET /api/health-check', () => {
    it('Should return OK', (done) => {
      request(app)
        .get('/api/health-check')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.text).to.equal('OK');
          done();
        })
        .catch(done);
    });
  });



  describe('# GET /api/404', () => {
    it('Should return 404 status', (done) => {
      request(app)
        .get('/api/404')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.message).to.equal('Not Found');
          done();
        })
        .catch(done);
    });
  });


  describe('# GET /api/tenki-forecast - Good response, chilean coordinates', () => {
    it('Should return "ok" status and expected country and capital weather data', function(done) {

      // Set timeout to wait for APIs requests
      // Note: this only works with old style js, no arrow function allowed
      // @see https://stackoverflow.com/questions/48411794/getting-error-error-timeout-of-2000ms-exceeded-for-async-tests-and-hooks-en
      this.timeout(5000);
      setTimeout(done, 5000);

      request(app)
        .post('/api/tenki-forecast')
        .send({
          latitude : -33.4446699,
          longitude : -70.6493836
        })
        .expect(httpStatus.OK)
        .then((res) => {

          expect(res.body.status, 'status-check').to.equal('ok');

          var data = res.body.data;
          // console.log(data);
          expect(data).to.have.property('country');
          expect(data.country).to.have.property('name');

          expect(data).to.have.property('capital');
          expect(data.capital).to.have.property('name');
          expect(data.capital).to.have.property('latitude');
          expect(data.capital).to.have.property('longitude');

          expect(data).to.have.property('weather');
          expect(data.weather).to.have.property('summary');
          expect(data.weather).to.have.property('season');

          done();
        })
        .catch(done);
    });
  });


  describe('# GET /api/tenki-forecast - Good response, Japan ocean coordinates, no results found', () => {
    it('Should return "error" status and "No results found" message', function(done) {

      // Set timeout to wait for APIs requests
      // Note: this only works with old style js, no arrow function allowed
      // @see https://stackoverflow.com/questions/48411794/getting-error-error-timeout-of-2000ms-exceeded-for-async-tests-and-hooks-en
      this.timeout(5000);
      setTimeout(done, 5000);

      request(app)
        .post('/api/tenki-forecast')
        .send({
          latitude : 31.052934,
          longitude : 137.180258
        })
        .expect(httpStatus.OK)
        .then((res) => {

          expect(res.body.status, 'status-check').to.equal('error');
          expect(res.body.message, 'message-check').to.equal('Country data cannot be retrieved. Reason: No results found');

          done();
        })
        .catch(done);
    });
  });


  describe('# GET /api/tenki-forecast - Error response, bad coordinates', () => {
    it('Should return "error" status and "400 Bad Request" message', function(done) {

      // Set timeout to wait for APIs requests
      // Note: this only works with old style js, no arrow function allowed
      // @see https://stackoverflow.com/questions/48411794/getting-error-error-timeout-of-2000ms-exceeded-for-async-tests-and-hooks-en
      this.timeout(5000);
      setTimeout(done, 5000);

      request(app)
        .post('/api/tenki-forecast')
        .send({
          latitude : -48.551529,
          longitude : -497.353690
        })
        .expect(httpStatus.OK)
        .then((res) => {

          expect(res.body.status, 'status-check').to.equal('error');
          expect(res.body.message, 'message-check').to.equal('Country data cannot be retrieved. Response: 400 Bad Request');

          done();
        })
        .catch(done);
    });
  });


  describe('# Error Handling', () => {
    it('Should handle /api/error throwing error test', (done) => {
      request(app)
        .get('/api/error')
        .expect(httpStatus.INTERNAL_SERVER_ERROR)
        .then((res) => {
          expect(res.body.message).to.equal('Internal Server Error');
          done();
        })
        .catch(done);
    });

    // it('should handle express validation error - username is required', (done) => {
    //   request(app)
    //     .post('/api/users')
    //     .send({
    //       mobileNumber: '1234567890'
    //     })
    //     .expect(httpStatus.BAD_REQUEST)
    //     .then((res) => {
    //       expect(res.body.message).to.equal('"username" is required');
    //       done();
    //     })
    //     .catch(done);
    // });
  });
});

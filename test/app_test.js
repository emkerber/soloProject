var request = require('supertest');
var expect = require('chai').expect;
var server = require('../server');

describe('testing server logic', function() {

  it('should test if a user can log in', function(done) {

    request(server)
      .post('/register')
      .send({phoneNumber: '987', passwordFirst: '987', passwordSecond: '987'})
      .expect(200, done)
  });
});

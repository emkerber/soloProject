var request = require('supertest');
var expect = require('chai').expect;
var server = require('../server');


// If running test, send a new phoneNumber and passwordFirst/passwordSecond
// Test will otherwise fail because these are already registered in the database

// describe('testing server logic', function() {
//
//   it('should test if a user can log in', function(done) {
// 
//     request(server)
//       .post('/register')
//       .send({phoneNumber: '987', passwordFirst: '987', passwordSecond: '987'})
//       .expect(200, done)
//   });
// });

var router = require('express').Router();
var path = require('path');

var User = require('../models/user');

router.get('/', function(request, response) {
  if (request.body.passwordFirst === request.body.passwordSecond) {
    router.post('/', function(request, response) {
      User.create(request.body.phoneNumber, request.body.passwordFirst, function(err) {
        if (err) {
          console.log('Error creating new user', err);
        } else {
          response.redirect('../');
        }
      });
    });
  } else {
    response.redirect('../registrationFail');
  }
});

module.exports = router;

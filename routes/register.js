var router = require('express').Router();
var path = require('path');

var User = require('../models/user');

router.post('/', function(request, response) {
  if (request.body.passwordFirst === request.body.passwordSecond) {
    User.create(request.body.phoneNumber, request.body.passwordFirst, function(err) {
      if (err) {
        console.log('Error creating new user', err);
        response.sendStatus(500);
      } else {
        response.sendStatus(200);
      }
    });
  } else {
    response.sendStatus(400);
  }
});

module.exports = router;

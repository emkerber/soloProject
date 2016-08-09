// register view Express router
var router = require('express').Router();
var path = require('path');

// to use the queries in the users model
var User = require('../models/user');

router.post('/', function(request, response) {

  // if both passwords entered on the DOM match
  if (request.body.passwordFirst === request.body.passwordSecond) {

    // create a new user using the information entered on the DOM 
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

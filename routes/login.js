//login view Express router
var router = require('express').Router();
var passport = require('passport');

//authenticate the user who is trying to log in
//the users and their passwords are stored on a local database
router.post('/', passport.authenticate('local'), function(request, response) {
  //if authentication was successful:
  response.sendStatus(200);
});

module.exports = router;

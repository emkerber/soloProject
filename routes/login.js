var router = require('express').Router();
var passport = require('passport');

router.post('/', passport.authenticate('local'), function(request, response) {
  response.sendStatus(200);
});

module.exports = router;

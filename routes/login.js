var router = require('express').Router();
var passport = require('passport');

router.get('/success', function(request, response) {
  response.sendStatus(200);
});

router.get('/fail', function(request, response) {
  response.sendStatus(401);
});

router.post('/', passport.authenticate('local', {
  successRedirect: '/login/success',
  failureRedirect: '/login/fail'
}));

module.exports = router;

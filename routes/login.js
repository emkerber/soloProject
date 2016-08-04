var router = require('express').Router();
var passport = require('passport');

router.get('/', function(request, response) {
  response.send(request.isAuthenticated());
});

router.get('/main', function(request, response) {
  response.sendStatus(200);
});

router.get('/loginFail', function(request, response) {
  response.sendStatus(401);
});

router.post('/', passport.authenticate('local', {
  successRedirect: '/main',
  failureRedirect: '/loginFail'
}));

module.exports = router;

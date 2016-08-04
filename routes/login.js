var router = require('express').Router();
var passport = require('passport');

router.get('/', function(request, response) {
  response.send(request.isAuthenticated());
});

router.get()

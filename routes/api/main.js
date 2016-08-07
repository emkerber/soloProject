var router = require('express').Router();

router.get('/', function(request, response) {
  response.send('Made it to Main!');
});

module.exports = router;

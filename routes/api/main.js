var router = require('express').Router();

var Notification = require('../../models/notifications');
var User = require('../../models/user');


router.get('/', function(request, response) {

  Notification.selectFive(function(err, notifications) {

    if (err) {
      console.log('Error selecting five notifications', err);
      response.sendStatus(500);
    } else {
      response.send(notifications);
    }
  });
});

router.post('/', function(request, response) {

  var currentUser = request.user.phonenumber;
  var textContent = request.body.textContent;
  console.log('main.js text content:', textContent, 'current user:', currentUser);

  User.updateTextContent(currentUser, textContent, function(err) {
    if (err) {
      console.log('Error updating text content from server');
    }
  });
});

module.exports = router;

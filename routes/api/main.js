// main view Express route
var router = require('express').Router();

// to use the queries in the notifications and user models
var Notification = require('../../models/notifications');
var User = require('../../models/user');


router.get('/', function(request, response) {

  // the phone number of the user making the request (who is logged in) is used
  Notification.selectFive(request.user.phonenumber, function(err, notifications) {

    if (err) {
      console.log('Error selecting five notifications', err);
      response.sendStatus(500);
    } else {
      response.send(notifications);
    }
  });
});

router.post('/', function(request, response) {

  // the phone number of the user making the request (who is logged in) is used
  var currentUser = request.user.phonenumber;
  // the string that was entered on the DOM and $http.posted is grabbed from the request
  var textContent = request.body.textContent;

  // console.log('main.js text content:', textContent, 'current user:', currentUser);

  // replaces the user's stored textcontent with the DOM's input 
  User.updateTextContent(currentUser, textContent, function(err) {
    if (err) {
      response.sendStatus(500);
    } else {
      response.sendStatus(204);
    }
  });
});

module.exports = router;

// history view Express route
var router = require('express').Router();

// to use the queries in the notifications model
var Notification = require('../../models/notifications');


router.get('/', function(request, response) {

  // the phone number of the user making the request (who is logged in) is used
  Notification.selectAll(request.user.phonenumber, function(err, notifications) {

    if (err) {
      console.log('Error selecting all notifications', err);
      response.sendStatus(500);
    } else {
      response.send(notifications);
    }
  });
});

module.exports = router;

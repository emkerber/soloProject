var router = require('express').Router();

var Notification = require('../../models/notifications');


router.get('/', function(request, response) {

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

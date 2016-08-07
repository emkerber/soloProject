var router = require('express').Router();
// var pg = require('pg');

var Notification = require('../../models/notifications');



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

module.exports = router;

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var pg = require('pg');
var passport = require('passport');
var session = require('express-session');
var LocalStrategy = require('passport-local').Strategy;

// Express routes
var login = require('./routes/login');
var register = require('./routes/register');
var main = require('./routes/api/main');
var history = require('./routes/api/history');

// models for Postgres queries
var User = require('./models/user');
var Notification = require('./models/notifications');

// for Particle Photon hardware
var Particle = require('particle-api-js');
var particle = new Particle();

// Twilio is the service used for sending SMS messages
var twilioClient = require('twilio')('AC35239131a1041d2f37a681f00894956f', '044d69b3544d959fdcf9dfeb64776a90');

// to query Postgres for the correct textcontent based on phonenumber
var pool = new pg.Pool({database: 'dingDogSwitch', port: 5432});



// configures the Express session
app.use(session({
  secret: 'beagle',
  key: 'user',
  resave: true,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 60 * 1000, secure: false } // timeout is 30 minutes
}));



app.use(passport.initialize());
app.use(passport.session());

// user information is stored locally
passport.use('local', new LocalStrategy({

  usernameField: 'phonenumber', // phonenumbers are used as usernames
  passwordField: 'password'

}, function(phonenumber, password, done) {

  // check to see if the password entered matches the one stored for that user
  User.findAndComparePassword(phonenumber, password, function(err, isMatch, user) {
    if (err) {
      return done(err);
    }

    if (isMatch) {
      // console.log('User successfully authorized');
      return done(null, user);
    } else {
      console.log('Failed to authorize user');
      done(null, false);
    }
  });
}));

// converts user to user id, to save space during the session
passport.serializeUser(function(user, done) {

  done(null, user.id);
});

// converts user id to user, for accessing user's information
passport.deserializeUser(function(id, done) {

  User.findById(id, function(err, user) {

    if (err) {
      console.log('Error deserializing user');
      return done(err);
    }

    done(null, user);
  });
});



app.use(bodyParser.json());
app.use(express.static('public')); // use the files in the public directory for static views



// non-authenticated routes (does not need login)
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'public/views/index.html'));
});

app.use('/login', login);
app.use('/register', register);

// authenticated routes, must be authorized to access
app.get('/api/*', function(request, response, next) {
  if (request.isAuthenticated()) {
    next();
  } else {
    response.redirect('/');
  }
});

app.use('/api/main', main);
app.use('/api/history', history);

// catch-all route, if none of the above match
app.get('/*', function(request, response) {
  response.sendFile(path.join(__dirname, 'public/views/index.html'));
});



// for recording button presses and sending SMS messages
// the app logs into the Particle site
particle.login({username: 'hello@primeacademy.io', password: 'primeiot'})

  .then(function(data) {

    console.log('API call completed on promise resolve: ', data.body.access_token);
    particle.getEventStream({ deviceId: '3a0027001647343339383037', auth: data.body.access_token })

    .then(function(stream) {

      // when an event occurs, i.e. when the button is pressed...
      stream.on('event', function(data) {

        console.log('Event: ', data);

        // to obtain the most recently updated text message content
        pool.connect(function(err, client, done) {

          if (err) {
            console.log('Error connecting to Postgres from server.js');
            done();
          }

          // these will be used for storing a new notification on the database
          var notificationText = '';
          var notificationPhonenumber = '9522124862'; //hard code this
          // the Twilio trail membership requires phonenumbers to be registered
          // on their site before they can receive texts

          // find the desired textcontent for the phonenumber entered above
          client.query('SELECT textcontent FROM users WHERE phonenumber=$1;',
          [notificationPhonenumber], function(err, result) {

            if (err) {
              console.log('Error regarding client query from server.js');
              done();
            }

            notificationText = result.rows[0].textcontent;
            // console.log('text to be stored:', notificationText);

            // store a new notification in the database
            Notification.create(notificationPhonenumber, notificationText, function(err) {

              if (err) {
                console.log('Error recording button press');
              } else {
                // console.log('Success recording button press!');
              }
            });

            // send an SMS message using Twilio
            twilioClient.sendMessage({
              to: '+1' + notificationPhonenumber, // must be registered on the Twilio site before being used successfully
              from: '+16122604368', // number given by Twilio for use here
              body: notificationText
            }, function(err, responseData) { // executed when a response is received from Twilio

              if (!err) {
                console.log('Text successfully sent', responseData.body);
              }
            });

            done();
          });
        });
      });
    });
  },

  // if the Particle login fails
  function(err) {
    console.log('API call completed on promise fail: ', err);
  }
);



var port = process.env.PORT || 3000;
var server = app.listen(port, function() {
  console.log('Server listening on port', server.address().port);
});

var express = require('express');
var app = express();
// var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');

var passport = require('passport');
var session = require('express-session');
var LocalStrategy = require('passport-local').Strategy;

var login = require('./routes/login');
var register = require('./routes/register');
var main = require('./routes/api/main');
var history = require('./routes/api/history');

var User = require('./models/user');
var Notification = require('./models/notifications');

var Particle = require('particle-api-js');
var particle = new Particle();



app.use(session({
  secret: 'beagle',
  key: 'user',
  resave: true,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 60 * 1000, secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

// var tempPhonenumber = '';

passport.use('local', new LocalStrategy({
  usernameField: 'phonenumber',
  passwordField: 'password'
}, function(phonenumber, password, done) {
  User.findAndComparePassword(phonenumber, password, function(err, isMatch, user) {
    if (err) {
      return done(err);
    }

    if (isMatch) {
      console.log('User successfully authorized');
      // tempPhonenumber = phonenumber;
      // console.log('tempPhonenumber stored as', tempPhonenumber);
      return done(null, user);
    } else {
      console.log('Failed to authorize user');
      done(null, false);
    }
  });
}));

//converts user to user id
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

//converts user id to user
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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// app.get('/', function(request, response) {
//   response.sendFile(path.join(__dirname, 'public/views/index.html'));
// });
//


//Routes here ARE redirected to login (if not authed)
app.use('/login', login);
app.use('/register', register);
app.use('/api/main', main);
app.use('/api/history', history);


//Routes here are not redirected to login (if not authed)
app.get('/api/*', function(request, response, next) {
  if (request.isAuthenticated()) {
    next();
  } else {
    response.redirect('/');
  }
});


app.get('/*', function(request, response) {
  response.sendFile(path.join(__dirname, 'public/views/index.html'));
});





particle.login({username: 'hello@primeacademy.io', password: 'primeiot'})

  .then(function(data) {

    console.log('API call completed on promise resolve: ', data.body.access_token);
    particle.getEventStream({ deviceId: '3a0027001647343339383037', auth: data.body.access_token })

    .then(function(stream) {

      stream.on('event', function(data) {
        console.log('Event: ', data);
        Notification.create(textContent, function(err) {

          if (err) {
            console.log('Error recording button press');
          } else {
            console.log('Success recording button press!');
          }
        });
      });
    });
  },
  function(err) {
    console.log('API call completed on promise fail: ', err);
  }
);

// //DATA RETURNED FROM EVENT (PHOTON BUTTON PRESSED)
// { data: 'null',
//   ttl: '60',
//   published_at: '2016-08-05T23:08:26.737Z',
//   coreid: '3a0027001647343339383037',
//   name: 'buttonState' }

// // PHOTON DEVICE INFO
// { id: '3a0027001647343339383037',
//   name: 'blue',
//   last_app: null,
//   last_ip_address: '204.62.150.131',
//   last_heard: '2016-08-05T19:30:43.706Z',
//   product_id: 6,
//   connected: true,
//   platform_id: 6,
//   cellular: false,
//   status: 'normal' }


var port = process.env.PORT || 3000;
var server = app.listen(port, function() {
  console.log('Server listening on port', server.address().port);
});

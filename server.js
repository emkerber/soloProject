var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');

var passport = require('passport');
var session = require('express-session');
var LocalStrategy = require('passport-local').Strategy;

var User = require('./models/user');
var login = require('./routes/login');
var register = require('./routes/register');
var main = require('./routes/main');
var history = require('./routes/history');

app.use(session({
  secret: 'beagle',
  key: 'user',
  resave: true,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 60 * 1000, secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use('local', new LocalStrategy({
  usernameField: 'phoneNumber',
  passwordField: 'password'
}, function(phoneNumber, password, done) {
  User.findAndComparePassword(phoneNumber, password, function(err, isMatch, user) {
    if (err) {
      return done(err);
    }

    if (isMatch) {
      console.log('User successfully authorized');
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

app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'public/views/index.html'));
});



//Routes here ARE redirected to login (if not authed)

app.use('/login', login);
app.use('/register', register);
// app.use('/api/main', main);
// app.use('/api/history', history

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

var port = process.env.PORT || 3000;
var server = app.listen(port, function() {
  console.log('Server listening on port', server.address().port);
});

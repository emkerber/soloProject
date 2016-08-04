var pg = require('pg');
var bcrypt = require('bcrypt');

var SALT_WORK_FACTOR = 10;

var config = {
  database: 'dingDogSwitch',
  port: 5432,
  max: 10,
  idleTimeoutMillis: 30000
};

var pool = new pg.Pool(config);

function findByPhoneNumber(phoneNumber, callback) {

  pool.connect(function(err, client, done) {

    if (err) {
      done();
      console.log('Error connecting to pool');
      return callback(err);
    }

    client.query('SELECT * FROM users WHERE phoneNumber=$1;', [phoneNumber], function(err, result) {

      if (err) {
        done();
        console.log('Error regarding findByPhoneNumber query');
        return callback(err);
      }

      callback(null, result.rows[0]);
      done();
    });
  });
}

function create(phoneNumber, password, callback) {

  bcrypt.hash(password, SALT_WORK_FACTOR, function(err, hash) {

    pool.connect(function(err, client, done) {

      if (err) {
        done();
        console.log('Error connecting to pool while hashing password');
        return callback(err);
      }

      client.query('INSERT INTO users (phoneNumber, password) ' +
      'VALUES ($1, $2) RETURNING id, phoneNumber;', [phoneNumber, hash],
      function(err, result) {

        if (err) {
          done();
          console.log('Error adding user and their password to table');
          return callback(err);
        }

        callback(null, result.rows[0]);
        done();
      });
    });
  });
}

function findAndComparePassword(phoneNumber, candidatePassword, callback) {

  findByPhoneNumber(phoneNumber, function(err, user) {

    if (err) {
      console.log('Error finding by phoneNumber to compare passwords');
      return callback(err);
    }

    if (!user) {
      console.log('User does not exist!');
      return callback(null, false);
    }

    bcrypt.compare(candidatePassword, user.password, function(err, isMatch) {

      if (err) {
        console.log('Error comparing entered password with stored password', err);
        callback(err);
      } else {
        console.log('Passwords match', isMatch);
        callback(null, isMatch, user);
      };
    });
  });
}

module.exports = {
  findByPhoneNumber: findByPhoneNumber,
  create: create,
  findAndComparePassword: findAndComparePassword
};

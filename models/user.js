var pg = require('pg');
var bcrypt = require('bcrypt');

var SALT_WORK_FACTOR = 10;

var config = {
  database: 'passport',
  port: 5432,
  max: 10,
  idleTimeoutMillis: 30000
};

var pool = new pg.Pool(config);

function findByUsername(username, callback) {
  pool.connect(function(err, client, done) {
    if (err) {
      done();
      return callback(err);
    }

    client.query('SELECT * FROM users WHERE username=$1;', [username], function(err, result) {
      if (err) {
        done();
        return callback(err);
      }

      callback(null, result.rows[0]);
      done();
    });
  });
}

function create(username, password, callback) {
  bcrypt.hash(password, SALT_WORK_FACTOR, function(err, hash) {
    pool.connect(function(err, client, done) {
      if (err) {
        done();
        return callback(err);
      }

      client.query('INSERT INTO users (username, password) ' +
      'VALUES ($1, $2) RETURNING id, username;', [username, hash],
      function(err, result) {

        if (err) {
          done();
          return callback(err);
        }

        callback(null, result.rows[0]);
        done();
      });
    });
  });
}

function findAndComparePassword(username, candidatePassword, callback) {

  findByUsername(username, function(err, user) {

    if (err) {
      return callback(err);
    }

    if (!user) {
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
  findByUsername: findByUsername,
  create: create,
  findAndComparePassword: findAndComparePassword
};

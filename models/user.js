var pool = require('./config');
var bcrypt = require('bcrypt'); // for hashing passwords


var SALT_WORK_FACTOR = 10;


// finds the stored information for a user by their phonenumber (which acts as username)
function findByPhoneNumber(phonenumber, callback) {

  pool.connect( // process.env.postgres:\/\/jlsximhokqedhg:bikw6jCbVnZjcZy8CAoC8TzLYn@ec2-54-243-48-181.compute-1.amazonaws.com:5432/di5sg15h9sqkr,
  function(err, client, done) {

    if (err) {
      done();
      console.log('Error connecting to pool');
      return callback(err);
    }

    client.query('SELECT * FROM users WHERE phonenumber=$1;', [phonenumber], function(err, result) {

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

// adds a user to the users table, storing their password after it's been hashed
function create(phonenumber, password, callback) {

  // does the hashing
  bcrypt.hash(password, SALT_WORK_FACTOR, function(err, hash) {

    // then makes the query
    pool.connect( // process.env.postgres:\/\/jlsximhokqedhg:bikw6jCbVnZjcZy8CAoC8TzLYn@ec2-54-243-48-181.compute-1.amazonaws.com:5432/di5sg15h9sqkr,
    function(err, client, done) {

      if (err) {
        done();
        console.log('Error connecting to pool while hashing password');
        return callback(err);
      }

      client.query('INSERT INTO users (phonenumber, password) ' +
      'VALUES ($1, $2) RETURNING id, phonenumber;', [phonenumber, hash],
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

// used for login, to check if the password entered matches the password stored for the phone number entered
function findAndComparePassword(phonenumber, candidatePassword, callback) {

  // first the phone number entered is looked up in the database
  findByPhoneNumber(phonenumber, function(err, user) {

    if (err) {
      console.log('Error finding by phonenumber to compare passwords');
      return callback(err);
    }

    // if the user isn't stored in the database:
    if (!user) {
      console.log('User does not exist!');
      return callback(err);
    }

    // compare the hashed password to the password entered using bcrypt
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

// finds a user's information in the user table by searching for their id
function findById(id, callback) {

  pool.connect( // process.env.postgres:\/\/jlsximhokqedhg:bikw6jCbVnZjcZy8CAoC8TzLYn@ec2-54-243-48-181.compute-1.amazonaws.com:5432/di5sg15h9sqkr,
  function(err, client, done) {
    if (err) {
      done();
      return callback(err);
    }

    client.query('SELECT * FROM users WHERE id=$1;', [id], function(err, result) {
      if (err) {
        done();
        return callback(err);
      }

      callback(null, result.rows[0]);
      done();
    });
  });
}

// used when the texts' content is updated on the main view of the app
// finds the correct user to update by checking who is logged into the app
function updateTextContent(phonenumber, textcontent, callback) {

  pool.connect( // process.env.postgres:\/\/jlsximhokqedhg:bikw6jCbVnZjcZy8CAoC8TzLYn@ec2-54-243-48-181.compute-1.amazonaws.com:5432/di5sg15h9sqkr,
  function(err, client, done) {
    if (err) {
      done();
      return callback(err);
    }

    client.query('UPDATE users SET textcontent=$1 WHERE phonenumber=$2;', [textcontent, phonenumber],
    function(err, result) {
      if (err) {
        done();
        return callback(err);
      }

      callback(null);
      done();
    });
  });
}

module.exports = {
  findByPhoneNumber: findByPhoneNumber,
  create: create,
  findAndComparePassword: findAndComparePassword,
  findById: findById,
  updateTextContent: updateTextContent
};

var pg = require('pg'); // PostgreSQL

var config = {
  database: 'ding-dog-switch',
  port: 5432
};

// pg.defaults.ssl = true;

var pool = new pg.Pool(config);

// inserts a new notification into the notifications table
function create(phonenumber, text, callback) {

  pool.connect( // process.env.postgres:\/\/jlsximhokqedhg:bikw6jCbVnZjcZy8CAoC8TzLYn@ec2-54-243-48-181.compute-1.amazonaws.com:5432/di5sg15h9sqkr,
  function(err, client, done) {

    if (err) {
      done();
      console.log('Error connecting to pool while adding notification');
      return callback(err);
    }

    var date = new Date().toLocaleDateString() + ' at ' + new Date().toLocaleTimeString();

    client.query('INSERT INTO notifications (phonenumber, date, text) VALUES ($1, $2, $3);', [phonenumber, date, text],
    function(err, result) {

      if (err) {
        done();
        console.log('Error adding new notification to table');
        return callback(err);
      }

      callback(null, result.rows[0]);
      done();
    });
  });
}

// this function is not being used at this time
// gets the information for a specific notification based on id
// function findById(id, callback) {
//
//   pool.connect(process.env.postgres:\/\/jlsximhokqedhg:bikw6jCbVnZjcZy8CAoC8TzLYn@ec2-54-243-48-181.compute-1.amazonaws.com:5432/di5sg15h9sqkr,
//   function(err, client, done) {
//
//     if (err) {
//       done();
//       return callback(err);
//     }
//
//     client.query('SELECT * FROM notifications WHERE id=$1;', [id], function(err, result) {
//
//       if (err) {
//         done();
//         return callback(err);
//       }
//
//       callback(null, result.rows[0]);
//       done();
//     });
//   });
// }

// returns the date and text content of the five most recent notifications
function selectFive(phonenumber, callback) {

  pool.connect( // process.env.postgres:\/\/jlsximhokqedhg:bikw6jCbVnZjcZy8CAoC8TzLYn@ec2-54-243-48-181.compute-1.amazonaws.com:5432/di5sg15h9sqkr,
  function(err, client, done) {

    if (err) {
      done();
      console.log('Error connecting to pool in selectFive function');
      return callback(err);
    }

    client.query('SELECT date, text FROM notifications WHERE phonenumber=$1 ORDER BY id DESC LIMIT 5;', [phonenumber], function(err, result) {

      if (err) {
        done();
        console.log('Error querying database in selectFive function');
      }

      callback(null, result);
      done();
    });
  });
}

// returns the date and text content of all of the notifications, with the most recent first
function selectAll(phonenumber, callback) {

  pool.connect( // process.env.postgres:\/\/jlsximhokqedhg:bikw6jCbVnZjcZy8CAoC8TzLYn@ec2-54-243-48-181.compute-1.amazonaws.com:5432/di5sg15h9sqkr,
  function(err, client, done) {

    if (err) {
      done();
      return callback(err);
    }

    client.query('SELECT date, text FROM notifications WHERE phonenumber=$1 ORDER BY id DESC;', [phonenumber], function(err, result) {

      if (err) {
        done();
        return callback(err);
      }

      callback(null, result);
      done();
    });
  });
}


module.exports = {
  create: create,
  // findById: findById,
  selectFive: selectFive,
  selectAll: selectAll
};

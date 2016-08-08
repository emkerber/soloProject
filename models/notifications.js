var pg = require('pg');

var config = {
  database: 'dingDogSwitch',
  port: 5432
};

var pool = new pg.Pool(config);

function create(phonenumber, text, callback) {

  pool.connect(function(err, client, done) {

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

// function findById(id, callback) {
//
//   pool.connect(function(err, client, done) {
//
//     if (err) {
//       done();
//       return callback(err);
//     }
//
//     client.query('SELECT * FROM users WHERE id=$1;', [id], function(err, result) {
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

function selectFive(phonenumber, callback) {

  pool.connect(function(err, client, done) {

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

function selectAll(phonenumber, callback) {

  pool.connect(function(err, client, done) {

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

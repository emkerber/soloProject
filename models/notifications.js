var pg = require('pg');

var config = {
  database: 'dingDogSwitch',
  port: 5432
};

var pool = new pg.Pool(config);

function create(text, callback) {

  pool.connect(function(err, client, done) {

    if (err) {
      done();
      console.log('Error connecting to pool while adding notification');
      return callback(err);
    }

    //also insert date and time


    var date = new Date().toLocaleDateString() + ' at ' + new Date().toLocaleTimeString();

    client.query('INSERT INTO notifications (phonenumber, date, text) VALUES ($1, $2, $3) RETURNING id;', ['9522124862', date, text],
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

function findById(id, callback) {

  pool.connect(function(err, client, done) {

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

function selectFive(callback) {

  pool.connect(function(err, client, done) {

    if (err) {
      done();
      console.log('Error connecting to pool in selectFive function');
      return callback(err);
    }

    client.query('SELECT date, text FROM notifications ORDER BY id DESC LIMIT 5;', function(err, result) {

      if (err) {
        done();
        console.log('Error querying database in selectFive function');
      }

      callback(null, result);
      done();
    });
  });
}

function selectAll(callback) {

  pool.connect(function(err, client, done) {

    if (err) {
      done();
      return callback(err);
    }

    client.query('SELECT date, text FROM notifications ORDER BY id DESC;', function(err, result) {

      if (err) {
        done();
        return callback(err);
      }

      callback(null,
        [result.rows[0], result.rows[1], result.rows[2], result.rows[3], result.rows[4]]);
      done();
    });
  });
}


module.exports = {
  create: create,
  findById: findById,
  selectFive: selectFive,
  selectAll: selectAll
};

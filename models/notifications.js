var pg = require('pg');

var config = {
  database: 'dingDogSwitch',
  port: 5432,
  max: 10
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

    var date = new Date();

    client.query('INSERT INTO notifications (date, text) VALUES ($1, $2) RETURNING id;', [date, text],
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


module.exports = {
  create: create,
  findById: findById
};

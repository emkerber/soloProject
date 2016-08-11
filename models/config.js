var pg = require('pg');
var url = require('url');

var params = url.parse(process.env.DATABASE_URL);
var auth = params.auth ? params.auth.split(':') : [null, null];

var config = {
  user: auth[0],
  password: auth[1],
  host: params.hostname,
  port: params.port,
  database: params.pathname.split('/')[1],
  ssl: process.env.SSL
};

module.exports = new pg.Pool(config);

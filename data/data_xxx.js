const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'xxx',
  user: 'xxx',
  database: 'xxx',
  namedPlaceholders: true,
  decimalNumbers: true,
  bigNumberStrings: false,
});

module.exports = {
  pool,
};

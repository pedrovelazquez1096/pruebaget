const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'sql5.freesqldatabase.com',
  user: 'sql5788825',
  password: 'YTsQn45De6',
  database: 'sql5788825',
  port: 3306
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Conectado a la base de datos');
});

module.exports = connection;
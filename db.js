const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'booking-391110:europe-west2:admin',
  user: 'izzy',
  password: 'D"$DYSQX6=fU@lEF',
  database: 'bookingdb'
});
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database.');
});

module.exports = connection;

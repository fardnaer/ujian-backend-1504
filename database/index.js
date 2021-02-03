const mysql = require('mysql')

const connection = mysql.createConnection({
    // host: process.env.DB_HOST,
    // port: process.env.DB_PORT,
    // user: process.env.DB_USER,
    // password: process.env.DB_PASS,
    // database: process.env.DB_DBNAME
    host: 'localhost',
    port: 3306,
    user: 'test',
    password: 'test123',
    database: 'backend_2021',
})

module.exports = connection
const mysql = require('mysql');

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'codermehraj',
    password: 'Helloworld1?',
    database: 'TO_DO_APP_LOCAL',
});



module.exports = {     
    db
}
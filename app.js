const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
//const mysql = require('mysql');
const cors = require('cors');

// Create an instance of Express
const app = express();

// port of server
const port = 3000;


// Use body-parser middleware to parse request bodies
app.use(bodyParser.json());
app.use(cors()); // for access control alow origin

const { secretKey, db } = require('./database')

const { authenticateToken } = require('./tokenManager')

app.post('/login', (req, res) => {

    // Login route - generates and returns a token
    // [POST] http://localhost:3000/login
    // in body add username and password as JSON

    const { username, password } = req.body;

    // SQL query to validate user credentials
    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(sql, [username, password], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error.', error: err });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const user = { username: username, role: 'admin' };

        const token = jwt.sign(user, secretKey, { expiresIn: '1h' });

        res.json({ token: token });
    });
});

app.post('/signup', (req, res) => {

    // Signup route - registers a new user
    // [POST] http://localhost:3000/signup
    // in body add username and password as JSON

    const { username, password } = req.body;

    // Check if the username already exists in the database
    const checkUserSql = 'SELECT * FROM users WHERE username = ?';
    db.query(checkUserSql, [username], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error.', error: err });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: 'Username already exists.' });
        }

        // SQL query to insert a new user into the database
        const insertUserSql = 'INSERT INTO users (username, password) VALUES (?, ?)';
        db.query(insertUserSql, [username, password], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Database error.', error: err });
            }

            const user = { username: username, role: 'admin' };

            const token = jwt.sign(user, secretKey, { expiresIn: '1h' });

            res.json({ message: "Account Created Successfully", token: token });
        });
    });
});

app.get('/users', (req, res) => {

    // SQL query to fetch all usernames from the database table
    // [GET] http://localhost:3000/users
    // Empty body

    const sql = 'SELECT username FROM users';
    db.query(sql, (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Database error.' });
      }
  
      res.json(results);
    });
});



// Start the server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
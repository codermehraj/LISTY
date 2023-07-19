const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

// Create an instance of Express
const app = express();

// Use body-parser middleware to parse request bodies
app.use(bodyParser.json());
app.use(cors()); // for access control alow origin

// Secret key for JWT
const secretKey = 'akhaliaSchool';

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'codermehraj',
    password: 'Helloworld1?',
    database: 'TO_DO_APP_LOCAL',
});


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

const {secretKey, db} = require('./database')

const {authenticateToken} = require('./tokenManager')


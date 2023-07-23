const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

// Create an instance of Express
const app = express();

// port of server
const port = 3000;

// Use body-parser middleware to parse request bodies
app.use(bodyParser.json());
app.use(cors()); // for access control alow origin

const { db } = require('./utility/database')
const { authenticateToken, secretKey } = require('./utility/tokenManager')

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

app.post('/newList', authenticateToken, (req, res) => {
    const { id, name, username } = req.body;

    // SQL query to insert a new user into the database
    const sql = 'INSERT INTO notes VALUES (?, ?, ?)';
    db.query(sql, [id, name, username], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error.', msg: err });
        }

        const successMsg = { message: "added list", listName: name };
        res.status(201).json(successMsg);
    });
});

app.post('/newListElement', authenticateToken, (req, res) => {
    const { id, nid, name, complete } = req.body;

    // SQL query to insert a new user into the database
    const sql = 'INSERT INTO tasks VALUES (?, ?, ?, ?)';
    db.query(sql, [id, nid, name, complete], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error.', msg: err });
        }

        const successMsg = { message: "added list item", listItemName: name };
        res.status(201).json(successMsg);
    });
});

app.post('/updateTaskElement', authenticateToken, (req, res) => {
    const { id, nid, name, complete } = req.body;

    // SQL query to insert a new user into the database
    const sql = 'UPDATE tasks SET name = ?, complete = ? WHERE id = ?';
    db.query(sql, [name, complete, id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error.', msg: err });
        }

        const successMsg = { message: "updated list item" + result, listItemName: name };
        res.status(201).json(successMsg);
    });
});

app.post('/deleteCompletedFromList', authenticateToken, (req, res) => {
    const { nid } = req.body;

    // SQL query to insert a new user into the database
    const sql = 'DELETE FROM tasks WHERE nid = ? AND complete = 1';
    db.query(sql, [nid], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error.', msg: err });
        }

        const successMsg = { message: "deleted completed list item" + result, listId: nid };
        res.status(201).json(successMsg);
    });
});

app.post('/deleteList', authenticateToken, (req, res) => {
    const { id } = req.body;

    // SQL query to insert a new user into the database
    const sql = 'DELETE FROM tasks WHERE nid = ?;';
    const sql2 = 'DELETE FROM notes WHERE id = ?;';
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error.', msg: err });
        }
        db.query(sql2, [id], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Database error.', msg: err });
            }
        })
        const successMsg = { message: "deleted the list" + result, listId: id };
        res.status(201).json(successMsg);
    });
});

app.get('/users', authenticateToken, (req, res) => {
    // SQL query to fetch all users from the database table
    const sql = 'SELECT * FROM users';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error.' });
        }

        res.json(results);
    });
});

app.get('/users/:id', authenticateToken, (req, res) => {
    const id = parseInt(req.params.id);

    // SQL query to fetch a user with the specified ID
    const sql = 'SELECT * FROM users WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.json(results[0]);
    });
});

app.get('/lists/:id', authenticateToken, (req, res) => {
    const id = req.params.id;
  
    const sql = 'SELECT * FROM notes WHERE username = ?';
    db.query(sql, [id], (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Database error.', id: id });
      }
      var notesArray = JSON.parse(JSON.stringify(results));
  
      // Create an array to hold all the promises
      const promiseArray = [];
  
      notesArray.forEach((element) => {
        let sql2 = 'SELECT id, name, complete FROM tasks WHERE nid = ?';
  
        // Create a promise for each query
        const promise = new Promise((resolve, reject) => {
          db.query(sql2, [element.id], (err, results) => {
            if (err) {
              reject(err);
            } else {
              const tmp = JSON.parse(JSON.stringify(results));
              element.tasks = tmp;
              //console.log(element)
              resolve();
            }
          });
        });
  
        promiseArray.push(promise);
      });
  
      // Wait for all the promises to resolve
      Promise.all(promiseArray)
        .then(() => {
          res.json(notesArray);
        })
        .catch((error) => {
          return res.status(500).json({ message: 'Database error.', error: error });
        });
    });
  });

// Start the server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
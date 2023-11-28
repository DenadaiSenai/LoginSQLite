const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose(); // Import SQLite

const app = express();

// Configuring the SQLite database
const db = new sqlite3.Database('user.db');

// Create users table if it doesn't exist
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)");
});

// Configure session
app.use(
  session({
    secret: 'YourSecretKeyForSessionEncryption',
    resave: true,
    saveUninitialized: true,
  })
);

app.use('/', express.static(__dirname + '/static'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('pages/index', { req: req });
  console.log(`${req.session.username ? `User ${req.session.username} logged in from IP ${req.connection.remoteAddress}` : 'User not logged in.'}  `);
});

app.get('/login', (req, res) => {
  res.render('pages/login', { req: req });
});

app.get('/about', (req, res) => {
  res.render('pages/about', { req: req });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';

  db.get(query, [username, password], (err, row) => {
    if (err) throw err;

    if (row) {
      req.session.loggedin = true;
      req.session.username = username;
      res.redirect('/dashboard');
    } else {
      res.redirect('/login_failed');
    }
  });
});

app.get('/cadastrar', (req, res) => {
  if (!req.session.loggedin) {
    res.render('pages/cadastrar', { req: req });
  } else {
    res.redirect('/dashboard', { req: req });
  }
});

app.post('/cadastrar', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM users WHERE username = ?';

  db.get(query, [username], (err, row) => {
    if (err) throw err;

    if (row) {
      res.redirect('/register_failed');
    } else {
      const insertQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
      db.run(insertQuery, [username, password], (err) => {
        if (err) throw err;

        req.session.loggedin = true;
        req.session.username = username;
        res.redirect('/register_ok');
      });
    }
  });
});

app.get('/register_failed', (req, res) => {
  res.render('pages/register_failed', { req: req });
});

app.get('/register_ok', (req, res) => {
  res.render('pages/register_ok', { req: req });
});

app.get('/login_failed', (req, res) => {
  res.render('pages/login_failed', { req: req });
});

app.get('/dashboard', (req, res) => {
  if (req.session.loggedin) {
    res.render('pages/dashboard', { req: req });
  } else {
    res.send('Please login to access this page. <a href="/">Login</a>');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

app.get('/teste', (req, res) => {
  res.render('pages/teste', { req: req });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

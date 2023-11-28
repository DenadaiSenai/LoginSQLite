const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const authRouter = require('./routes/authController');
const db = require('./database');

const app = express();
const port = 3000;

// Configurar express-session
app.use(session({
  secret: 'suaChaveSecreta',
  resave: false,
  saveUninitialized: true
}));

// Servir arquivos estáticos (por exemplo, imagens, folhas de estilo)
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); // Definir o mecanismo de visualização como EJS

// Middleware para verificar a sessão do usuário
app.use((req, res, next) => {
  if (req.session.user) {
    res.locals.user = req.session.user;
  }
  next();
});

// rota para home
app.get('/', (req, res) => {
  res.render('index');
});

// Rota para a página de login
app.get('/login', (req, res) => {
  res.render('login');
});

// Rota para a página de registro
app.get('/register', (req, res) => {
  res.render('register');
});

// Rota protegida para a dashboard
app.get('/dashboard', (req, res) => {
  if (res.locals.user) {
    res.render('dashboard', { user: res.locals.user });
  } else {
    res.redirect('/login');
  }
});

app.use('/auth', authRouter);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

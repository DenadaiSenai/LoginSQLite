const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../database');

const router = express.Router();

// Configurar express-session
router.use(require('express-session')({
  secret: 'suaChaveSecreta',
  resave: false,
  saveUninitialized: true
}));

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Buscar usuário no banco de dados
  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar usuário' });
    }

    if (!row) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    // Comparar senhas
    const passwordMatch = password == row.password;
    // const passwordMatch = await bcrypt.compare(password, row.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    // Salvar informações do usuário na sessão
    req.session.user = { id: row.id, username: row.username };
    res.render('dashboard', { user: req.session.user});
    // res.json({ message: 'Login bem-sucedido' });
  });
});

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  console.log(`${username} - ${password}`)

  // Verificar se o usuário já existe no banco de dados
  const existingUser = await new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });

  if (existingUser) {
    return res.status(400).json({ error: 'Usuário já existe' });
  }

  // Hash da senha
  const hashedPassword = password;
  // const hashedPassword = await bcrypt.hash(password, 10);

  // Inserir usuário no banco de dados
  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao cadastrar usuário' });
    }
    res.json({ message: 'Usuário cadastrado com sucesso' });
  });
});

router.get('/logout', (req, res) => {
  // Destruir a sessão
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao fazer logout' });
    }

    res.render('logout', { user: res.locals.user });

    // res.json({ message: 'Logout bem-sucedido' });
  });
});

module.exports = router;

const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const https = require("https");

const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();

const app = express();

// Configurando o banco de dados SQLite
const db = new sqlite3.Database("user.db"); // Altere o nome do arquivo do banco de dados se precisar

// Cria a tabela 'users' se não existir no arquivo do SQLite
db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)"
  );
});

// Configuração da sessão
app.use(
  session({
    secret: "YourSecretKeyForSessionEncryption",
    resave: true,
    saveUninitialized: true,
  })
);

// Configura uma rota estática, colocar nesta pasta arquivos de imagem, css, pdf, etc...
app.use("/", express.static(__dirname + "/static"));

// Engine do Express para processar o EJS (templates)
// Lembre-se que para uso do EJS uma pasta (diretório) 'views', precisa existir na raiz do projeto.
// E que todos os EJS serão processados a partir desta pasta

// Configuração do middleware para o EJS
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar EJS como o motor de visualização
app.set("view engine", "ejs");
// Configuração das rotas do servidor HTTP
// A lógica ddo processamento de cada rota deve ser realizada aqui
app.get("/", (req, res) => {
  // Passe a variável 'req' para o template e use-a nas páginas para renderizar partes do HTML conforme determinada condição
  // Por exemplo de o usuário estive logado, veja este exemplo no arquivo views/partials/header.ejs
  res.render("pages/index", { req: req });
  // Caso haja necessidade coloque pontos de verificação para verificar pontos da sua logica de negócios
  console.log(
    `${
      req.session.username
        ? `User ${req.session.username} logged in from IP ${req.connection.remoteAddress}`
        : "User not logged in."
    }  `
  );
});

// Rota para a página de login
app.get("/login", (req, res) => {
  // Quando for renderizar páginas pelo EJS, passe parametros para ele em forma de JSON
  res.render("pages/login", { req: req }); // Neste exemplo a váriavel req, que contém informações sobre a sessão está sendo enviada para o EJS
});

app.get("/about", (req, res) => {
  res.render("pages/about", { req: req });
});

// Rota para processar o formulário de login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const query = "SELECT * FROM users WHERE username = ? AND password = ?";

  db.get(query, [username, password], (err, row) => {
    if (err) throw err;

    if (row) {
      // Utilize req.session às variáveis de sessão para controlar a lógica de sua página em função da sessão, como
      // por exemplo se o usuário está autenticado (logado).
      req.session.loggedin = true;
      req.session.username = username; // Crie variáveis de controle adicionais caso haja ncessidade
      // req.session.dataLogin = new Date() // Exemplo de criação de variável de sessão para controlar o tempo de login.
      res.redirect("/dashboard");
    } else {
      res.redirect("/login_failed");
    }
  });
});

// Rota para efetuar o cadastro de usuário no banco de dados
app.get("/cadastrar", (req, res) => {
  if (!req.session.loggedin) {
    res.render("pages/cadastrar", { req: req });
  } else {
    res.redirect("/dashboard", { req: req });
  }
});

app.post("/cadastrar", (req, res) => {
  const { username, password } = req.body;
  // Verifica se o usuário já se encontra cadastrado
  const query = "SELECT * FROM users WHERE username = ?";

  db.get(query, [username], (err, row) => {
    if (err) throw err;

    if (row) {
      res.redirect("/register_failed");
    } else {
      // Caso não esteja cadastrado, cadastra o usuário
      const insertQuery =
        "INSERT INTO users (username, password) VALUES (?, ?)";
      db.run(insertQuery, [username, password], (err) => {
        if (err) throw err;
        // Aqui o login será efetuado, após o cadastro.
        req.session.loggedin = true;
        req.session.username = username;
        res.redirect("/register_ok");
      });
    }
  });
});

app.get("/register_failed", (req, res) => {
  res.render("pages/register_failed", { req: req });
});

app.get("/register_ok", (req, res) => {
  res.render("pages/register_ok", { req: req });
});

app.get("/login_failed", (req, res) => {
  console.log(JSON.stringify(req.status));
  res.render("pages/login_failed", { req: req });
});

app.get("/dashboard", (req, res) => {
  // Exemplo de uma rota (END POINT) controlado pela sessão do usuário logado.

  if (req.session.loggedin) {
    const query = "SELECT * FROM users";

    db.all(query, (err, rows) => {
      if (err) throw err;
      //if (row) {
      console.log(rows);
      res.render("pages/dashboard", { row: rows, req: req });
      //}
    });
  } else {
    res.redirect("/login_failed");
  }
});

// Rota para processar a saida (logout) do usuário
// Utilize-o para encerrar a sessão do usuário
// Dica 1: Coloque um link de 'SAIR' na sua aplicação web
// Dica 2: Você pode implementar um controle de tempo de sessão e encerrar a sessão do usuário caso este tempo passe.
app.get("/logout", (req, res) => {
  // Exemplo de uma rota (END POINT) controlado pela sessão do usuário logado.
  req.session.destroy(() => {
    res.redirect("/");
  });
});

app.get("/teste", (req, res) => {
  res.render("pages/teste", { req: req });
});

// Verificar se a pasta 'certs' existe
const certsPath = "./certs";
if (fs.existsSync(certsPath)) {
  // Configuração para HTTPS
  const privateKey = fs.readFileSync(`${certsPath}/localhost.key`, "utf8");
  const certificate = fs.readFileSync(`${certsPath}/localhost.crt`, "utf8");
  const credentials = { key: privateKey, cert: certificate };

  // Criar um servidor HTTPS
  const httpsServer = https.createServer(credentials, app);

  httpsServer.listen(3000, () => {
    console.log("---------LoginSQLite----------");
    console.log("Servidor HTTPS rodando na porta 3000");
  });
} else {
  // Iniciar o servidor HTTP na porta 3000
  app.listen(3001, () => {
    console.log("---------LoginSQLite----------");
    console.log(
      'Servidor HTTP rodando na porta 3001. HTTPS não disponível (pasta "certs" não encontrada).'
    );
  });
}

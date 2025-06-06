# Base de aplicação back-end:

## Nodejs + SQLite + Express + EJS

> Aplicação base para uso com nodejs.  
> _Utilizado no curso Técnico de Desenvolvimento de Sistemas - SENAI "Celso Charurui" CFP 5.12 - Sumaré - SP_

---

## Instalação e execução

1 - Instalar o [Nodejs](https://nodejs.org/en/download) de acordo com o sitema operacional  
2 - Clonar este repositório com [git clone](https://github.com/DenadaiSenai/LoginSQLite.git), ou outro aplicativo de versionamento  
3 - Instalar os módulos utilizados pelo aplicativo

> `npm install`

4 - Executar o aplicativo:

> `node app.js`

5 - Executar o browser e abrir a url [http://localhost:3000](http://localhost:3000)  
6 - Testar o aplicativo

```
Usuário : marcio
Senha   : 123
```

## A fazer (TO DO)

- [ ] Criptografar as senhas no banco de dados
- [x] Configurar o banco de dados a usar somente comparação _'BINÁRIA'_, para evitar o efeito de _'cadastro duplicado'_
- [ ] Criar um campo extra na página de cadastro para verificar a senha antes de realizar o inclusão no banco de dados

## Ambiente de execução e teste

**_Windows 10 Education 22H2_**  
_Nodejs - v16.16.0_

**_Linux Ubuntu 20.04.6 LTS_**  
_Nodejs - v18.17.1_

### Autor:

**_Marcio Denadai_**  
_Instrutor de Formação Profissional_  
_SENAI 'Dr. Celso Charuri' - Sumaré / SP - CFP 5.12_
